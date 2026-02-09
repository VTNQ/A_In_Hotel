import type { ActionItem } from "@/type/common";
import type { CustomerActionMenuProps } from "@/type/customer.types";
import { View } from "lucide-react";
import { useTranslation } from "react-i18next";
import ActionMenu from "../ui/ActionMenu";

const CustomerActionMenu:React.FC<CustomerActionMenuProps>=({
    customer,
    onView
})=>{
 const { t } = useTranslation();
  const actions: ActionItem[] = [
    {
      label: t("common.view"),
      icon: <View size={16} />,
      onClick: () => onView?.(customer),
    },
  ];
  return <ActionMenu actions={actions} />;
}
export default CustomerActionMenu;