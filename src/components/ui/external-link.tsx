import type { ComponentProps } from "react";

/** Link that opens in a new tab with safe rel attributes. */
export function ExternalLink(props: ComponentProps<"a">) {
  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}
