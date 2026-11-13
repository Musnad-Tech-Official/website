#!/usr/bin/env python3
"""اختبارات مدقق سجل التغييرات. لا تعتمد على مكتبات خارجية."""

from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from validate_manifest import validate  # noqa: E402

SOURCE = "ولا زلت أذكر منظرها حتى الآن.\n"
CORRECTED = "وما زلت أذكر منظرها حتى الآن.\n"


def make_manifest(source: str, corrected: str, source_id: str = "nahw_wafi", changes=None) -> dict:
    if changes is None:
        changes = [
            {
                "candidate_id": "C1",
                "before": "ولا زلت أذكر",
                "after": "وما زلت أذكر",
                "category": "negation",
                "severity": "blocking",
                "reason": "لا النافية لا تدخل على الماضي هنا",
                "source_id": source_id,
                "meaning_gates": {
                    "tense": "preserved",
                    "negation": "fixed",
                    "lexical": "preserved",
                    "reference": "preserved",
                    "voice": "preserved",
                },
            }
        ]
    return {
        "mode": "proofread",
        "scope": "grammar",
        "source_text_sha256": hashlib.sha256(source.encode("utf-8")).hexdigest(),
        "candidates": [],
        "accepted": [c["candidate_id"] for c in changes],
        "rejected": [],
        "changes": changes,
        "unresolved": [],
    }


def main() -> int:
    failures = []

    valid = make_manifest(SOURCE, CORRECTED)
    errors = validate(valid, SOURCE, CORRECTED, {"nahw_wafi"})
    if errors:
        failures.append(f"الحالة الصحيحة رُفضت: {errors}")

    silent = make_manifest(SOURCE, CORRECTED, changes=[])
    errors = validate(silent, SOURCE, CORRECTED, {"nahw_wafi"})
    if not any("نسخ صامت" in error for error in errors):
        failures.append("النسخ الصامت لم يُرفض")

    bad_source = make_manifest(SOURCE, CORRECTED, source_id="fake_source")
    errors = validate(bad_source, SOURCE, CORRECTED, {"nahw_wafi"})
    if not any("source_id" in error for error in errors):
        failures.append("المصدر المجهول لم يُرفض")

    bad_hash = make_manifest(SOURCE, CORRECTED)
    bad_hash["source_text_sha256"] = "0" * 64
    errors = validate(bad_hash, SOURCE, CORRECTED, {"nahw_wafi"})
    if not any("source_text_sha256" in error for error in errors):
        failures.append("بصمة النص الخاطئة لم تُرفض")

    if failures:
        for failure in failures:
            print(f"فشل: {failure}", file=sys.stderr)
        return 1

    print("نجحت اختبارات مدقق سجل التغييرات: ٤ حالات.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
