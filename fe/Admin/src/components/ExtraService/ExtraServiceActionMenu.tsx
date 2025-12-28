import { Edit, Power } from "lucide-react";
import type { ExtraServiceActionMenuProps } from "../../type";
import type { ActionItem } from "../ui/ActionMenu";
import ActionMenu from "../ui/ActionMenu";

const ExtraServiceActionMenu: React.FC<ExtraServiceActionMenuProps> = ({
    service,
    onEdit,
    onActivate,
    onDeactivate,
  }) => {
    const actions: ActionItem[] = service.isActive
      ? [

          { label: "Edit", icon: <Edit size={16} />, onClick: () => onEdit?.(service) },
          { label: "Deactivate", icon: <Power size={16} />, danger: true, onClick: () => onDeactivate?.(service) },
        ]
      : [

          { label: "Edit", icon: <Edit size={16} />, onClick: () => onEdit?.(service) },
          { label: "Activate", icon: <Power size={16} />, onClick: () => onActivate?.(service) },
        ];
  
    return (
      <ActionMenu
        title={service.isActive ? "Active" : "Inactive"}
        actions={actions}
      />
    );
  };
  
  export default ExtraServiceActionMenu;