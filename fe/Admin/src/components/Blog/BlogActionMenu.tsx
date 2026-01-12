import { Archive, CheckCircle, Edit, Eye, RotateCcw } from "lucide-react";
import type { ActionItem } from "../ui/ActionMenu";
import ActionMenu from "../ui/ActionMenu";
import { useTranslation } from "react-i18next";
import type { BlogActionMenuProps } from "../../type/blog.types";

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
    const { t } = useTranslation();
    switch(statusCode){
        case 1:
            statusLabel =t("blog.draft");
            actions=[
                { label: t("blog.viewBlog"), icon: <Eye size={16} />, onClick: () => onView?.(blog) },
                { label: t("common.edit"), icon: <Edit size={16} />, onClick: () => onEdit?.(blog) },
                { label: t("blog.publish"), icon: <CheckCircle size={16} className="text-green-600" />, onClick: () => onPublish?.(blog) },
            
            ]
            break;
        case 2:
            statusLabel =t("blog.published");
            actions=[
                { label: t("blog.viewBlog"), icon: <Eye size={16} />, onClick: () => onView?.(blog) },
                { label: t("common.edit"), icon: <Edit size={16} />, onClick: () => onEdit?.(blog) },
                { label: t("blog.archive"), icon: <Archive size={16} className="text-orange-600" />, onClick: () => onArchive?.(blog) }
            ]
            break;
        case 3:
            statusLabel=t("blog.Archived");
            actions=[
                { label: t("blog.viewBlog"), icon: <Eye size={16} />, onClick: () => onView?.(blog) },
                {label:t("blog.restore"),icon:<RotateCcw size={16} className="text-green-600" />,onClick:()=>onRestore?.(blog)}
            ]
            break;
            default:
                statusLabel = t("commom.unKnown");
                actions = [{ label: t("blog.viewBlog"), icon: <Eye size={16} />, onClick: () => onView?.(blog) }];
    }
    return <ActionMenu title={statusLabel} actions={actions} />;
}
export default BlogActionMenu;