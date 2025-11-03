import { Edit, Eye, Power } from "lucide-react";
import type { CategoryActionMenuProps } from "../../type";
import type { ActionItem } from "../ui/ActionMenu";
import ActionMenu from "../ui/ActionMenu";

const CategoryActionMenu: React.FC<CategoryActionMenuProps> = ({
    category,
    onView,
    onEdit,
    onActivate,
    onDeactivate,
  }) => {
    const actions: ActionItem[] = category.isActive
      ? [
          { label: "View", icon: <Eye size={16} />, onClick: () => onView?.(category) },
          { label: "Edit", icon: <Edit size={16} />, onClick: () => onEdit?.(category) },
          { label: "Deactivate", icon: <Power size={16} />, danger: true, onClick: () => onDeactivate?.(category) },
        ]
      : [
          { label: "View", icon: <Eye size={16} />, onClick: () => onView?.(category) },
          { label: "Edit", icon: <Edit size={16} />, onClick: () => onEdit?.(category) },
          { label: "Activate", icon: <Power size={16} />, onClick: () => onActivate?.(category) },
        ];
  
    return (
      <ActionMenu
        title={category.isActive ? "Active" : "Inactive"}
        actions={actions}
      />
    );
  };
  
  export default CategoryActionMenu;