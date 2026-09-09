export default function FlexibleCard({
  header = null,
  center = null,
  footer = null,
  cardClass = "",
  headerClass = "",
  centerClass = "",
  footerClass = "",
}) {
  return (
    <div className={cardClass}>
      {/* Header Section */}
      {header && <div className={headerClass}>{header}</div>}

      {/* Center Content */}
      {center && <div className={centerClass}>{center}</div>}

      {/* Footer Section */}
      {footer && <div className={footerClass}>{footer}</div>}
    </div>
  );
}
