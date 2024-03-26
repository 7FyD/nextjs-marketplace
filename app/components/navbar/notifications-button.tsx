"use client";

import { Button } from "../ui/button";

interface NotificationsButtonInterface {
  label: string;
  onClick: () => void;
  active: boolean;
  className?: string;
}

const NotificationsButton: React.FC<NotificationsButtonInterface> = ({
  label,
  onClick,
  active,
  className,
}) => {
  return (
    <Button onClick={onClick} variant="ghost" disabled={active}>
      {label}
    </Button>
  );
};

export default NotificationsButton;
