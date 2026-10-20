import "server-only";
import { getPageControlsAction } from "@/lib/page-control/actions";
import { createPageMetadata, type PageMetadataOptions } from "./metadata";

export async function getPageMetadata(options: PageMetadataOptions) {
  const pages = await getPageControlsAction();
  const page = pages.find((item) => item.path === options.path);
  return createPageMetadata({
    ...options,
    index: options.index !== false && (!page || page.status === "live"),
  });
}
