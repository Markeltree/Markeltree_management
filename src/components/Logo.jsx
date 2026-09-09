export default function Logo({
  lightLogo = "/logo-dark.png",
  darkLogo = "/logo-dark.png",
  alt = "App Logo",
  className = "h-10 w-auto ",
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
