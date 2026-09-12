import { BrandIcon } from "../BrandIcon";
import { APP_IMAGES } from "../brandImages";
import type { AppEntry } from "../apps";

export function AppMark({ app, customSrc }: { app: AppEntry; customSrc?: string }) {
  const src =
    app.name === "公众号"
      ? APP_IMAGES["公众号"]
      : app.name === "InkPai (Admin)"
        ? APP_IMAGES["InkPai"]
        : customSrc || APP_IMAGES[app.name];

  if (src) {
    return <img src={src} alt="" className="h-5 w-5 object-contain" />;
  }

  return <BrandIcon id={app.icon} className="h-5 w-5" />;
}
