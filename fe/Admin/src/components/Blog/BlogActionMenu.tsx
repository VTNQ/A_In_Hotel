import { Archive, CheckCircle, Edit, Eye, RotateCcw } from "lucide-react";
import type { BlogActionMenuProps } from "../../type";
import type { ActionItem } from "../ui/ActionMenu";
import ActionMenu from "../ui/ActionMenu";

const BlogActionMenu:React.FC<BlogActionMenuProps>=({
    blog,
    onView,
    onEdit,
    onPublish,
    onArchive,
    onRestore

})=>{
    const statusCode=blog.status;
    let actions: ActionItem[] = [];
    let statusLabel = "";
    switch(statusCode){
        case 1:
            statusLabel ="Draft";
            actions=[
                { label: "View", icon: <Eye size={16} />, onClick: () => onView?.(blog) },
                { label: "Edit", icon: <Edit size={16} />, onClick: () => onEdit?.(blog) },
                { label: "Publish", icon: <CheckCircle size={16} className="text-green-600" />, onClick: () => onPublish?.(blog) },
            
            ]
            break;
        case 2:
            statusLabel ="Published";
            actions=[
                { label: "View", icon: <Eye size={16} />, onClick: () => onView?.(blog) },
                { label: "Edit", icon: <Edit size={16} />, onClick: () => onEdit?.(blog) },
                { label: "Archive", icon: <Archive size={16} className="text-orange-600" />, onClick: () => onArchive?.(blog) }
            ]
            break;
        case 3:
            statusLabel="Archived";
            actions=[
                { label: "View", icon: <Eye size={16} />, onClick: () => onView?.(blog) },
                {label:"Restore",icon:<RotateCcw size={16} className="text-green-600" />,onClick:()=>onRestore?.(blog)}
            ]
            break;
            default:
                statusLabel = "Unknown";
                actions = [{ label: "View", icon: <Eye size={16} />, onClick: () => onView?.(blog) }];
    }
    return <ActionMenu title={statusLabel} actions={actions} />;
}
export default BlogActionMenu;