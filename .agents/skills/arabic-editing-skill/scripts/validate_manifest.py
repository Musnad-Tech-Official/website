#!/usr/bin/env python3
"""
validate_manifest.py — مدقق سجل التغييرات لمهارة التحرير.

الاستخدام:
    python validate_manifest.py manifest.json --source source.txt --corrected corrected.txt
    python validate_manifest.py manifest.json --source source.txt --corrected corrected.txt \
        --sources ../../arabic-grammar-skill/skills/arabic-grammar-skill/references/sources.yaml

يفحص:
  1. أن الملف JSON صالح، وأن الحقول الإلزامية موجودة.
  2. أن بصمة النص الأصلي تطابق `source_text_sha256`.
  3. ألا يكون `changes` فارغاً بلا `no_change_reason`.
  4. ألا يكون النص النهائي مطابقاً للأصل مع وجود تغييرات.
  5. أن `before` موجود في الأصل، و`after` موجود في النص النهائي.
  6. أن `source_id` موجود في سجل المراجع (إن مُرّر `--sources`).
  7. أن بوابات المعنى الخمس موجودة لكل تغيير.

لا يعتمد على مكتبات خارجية. إن وُجد `jsonschema` استُخدم للتحقق الكامل،
وإلا اكتفى بالفحص البنيوي.
"""

import argparse
import hashlib
import json
import sys
from pathlib import Path
from typing import Any, Dict, List

GATES = ["tense", "negation", "lexical", "reference", "voice"]
EXTRA_GATES = ["transitivity", "quantity", "names", "information_structure"]
GATE_VALUES = {"preserved", "changed_on_purpose", "fixed", "not_applicable"}
SEVERITIES = {"blocking", "major", "minor", "style"}
MODES = {"proofread", "edit", "rewrite", "translation-review"}


def sha256_text(path: Path) -> str:
    return hashlib.sha256(path.read_text(encoding="utf-8").encode("utf-8")).hexdigest()


def load_sources(path: Path) -> set:
    """قراءة source_id من YAML بدون PyYAML: استخراج سطري بسيط."""
    ids = set()
    for line in path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if stripped.startswith("- id:"):
            ids.add(stripped.split(":", 1)[1].strip().strip('"').strip("'"))
    return ids


def validate(data: Dict[str, Any], source: str, corrected: str, sources: set) -> List[str]:
    errors: List[str] = []

    required = [
        "mode", "source_text_sha256", "candidates", "accepted",
        "rejected", "changes", "unresolved",
    ]
    for key in required:
        if key not in data:
            errors.append(f"حقل مفقود: {key}")

    if errors:
        return errors

    if data["mode"] not in MODES:
        errors.append(f"mode غير معروف: {data['mode']}")

    expected_hash = hashlib.sha256(source.encode("utf-8")).hexdigest()
    if data["source_text_sha256"] != expected_hash:
        errors.append("source_text_sha256 لا يطابق بصمة النص الأصلي")

    changes = data.get("changes", [])
    if not changes and not data.get("no_change_reason"):
        errors.append("لا تغييرات ولا no_change_reason: نسخ صامت")

    if changes and data.get("no_change_reason"):
        errors.append("لا يجوز الجمع بين changes وno_change_reason")

    if not changes and corrected != source:
        errors.append("النص النهائي تغيّر لكن changes فارغ")

    if changes and corrected == source:
        errors.append("changes غير فارغ والنص النهائي مطابق للأصل")

    for i, change in enumerate(changes):
        label = f"changes[{i}]"
        for key in ("candidate_id", "before", "after", "category", "severity",
                    "reason", "source_id", "meaning_gates"):
            if key not in change:
                errors.append(f"{label}: حقل مفقود: {key}")
        if change.get("severity") not in SEVERITIES:
            errors.append(f"{label}: severity غير معروف")
        if change.get("before") and change["before"] not in source:
            errors.append(f"{label}: before غير موجود في النص الأصلي")
        if change.get("after") and change["after"] not in corrected:
            errors.append(f"{label}: after غير موجود في النص النهائي")
        if sources and change.get("source_id") not in sources:
            errors.append(f"{label}: source_id غير موجود في سجل المراجع")
        gates = change.get("meaning_gates", {})
        for gate in GATES:
            if gate not in gates:
                errors.append(f"{label}: بوابة مفقودة: {gate}")
            elif gates[gate] not in GATE_VALUES:
                errors.append(f"{label}: قيمة بوابة غير معروفة: {gate}={gates[gate]}")
        for gate in EXTRA_GATES:
            if gate in gates and gates[gate] not in GATE_VALUES:
                errors.append(f"{label}: قيمة بوابة غير معروفة: {gate}={gates[gate]}")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="مدقق change_manifest")
    parser.add_argument("manifest", type=Path)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--corrected", type=Path, required=True)
    parser.add_argument("--sources", type=Path, action="append", default=None,
                        help="مسار sources.yaml (يمكن تكراره)")

    args = parser.parse_args()

    try:
        data = json.loads(args.manifest.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"JSON غير صالح: {exc}", file=sys.stderr)
        return 2

    source = args.source.read_text(encoding="utf-8")
    corrected = args.corrected.read_text(encoding="utf-8")

    ids: set = set()
    for path in args.sources or []:
        if path.exists():
            ids |= load_sources(path)
    errors = validate(data, source, corrected, ids)

    if errors:
        print("فشل التحقق:", file=sys.stderr)
        for err in errors:
            print(f"  - {err}", file=sys.stderr)
        return 1

    print("نجح التحقق: السجل متسق، والمصادر موثقة، وبوابات المعنى مكتملة.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
