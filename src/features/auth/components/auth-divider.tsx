import { AUTH_COPY } from "../constants/content";

export function AuthDivider() {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <span aria-hidden className="h-px flex-1 bg-line" />
      {AUTH_COPY.common.or}
      <span aria-hidden className="h-px flex-1 bg-line" />
    </div>
  );
}
