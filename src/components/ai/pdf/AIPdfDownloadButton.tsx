import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";

import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";

type AIPdfDownloadButtonProps = {
  document: React.ReactElement;
  fileName: string;
  className?: string;
  variant?: any;
  size?: any;
  children: React.ReactNode;
  disabled?: boolean;
};

export const AIPdfDownloadButton: React.FC<AIPdfDownloadButtonProps> = ({
  document,
  fileName,
  className,
  variant = "outline",
  size = "sm",
  children,
  disabled,
}) => {
  return (
    <PDFDownloadLink document={document} fileName={fileName}>
      {({ loading }) => (
        <Button
          variant={variant}
          size={size}
          className={cn(className)}
          disabled={Boolean(disabled) || loading}
        >
          {loading ? "Po përgatitet…" : children}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default AIPdfDownloadButton;
