export default function Logo({
  lightLogo = "/logo-light.png",
  darkLogo = "/logo-dark.png",
  alt = "Markeltree",
  className = "h-8 w-auto",
}) {
  return (
    <>
      {/* Light mode logo */}
      <img src={lightLogo} alt={alt} className={`${className} dark:hidden`} />
      {/* Dark mode logo */}
      <img
        src={darkLogo}
        alt={alt}
        className={`${className} hidden dark:block`}
      />
    </>
  );
}
