import type { BreadcrumbProps } from "@/type/common";

const Breadcrumb = ({ items }: BreadcrumbProps) => {
    return (
        <div className="mt-1 text-sm text-gray-500">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <span key={index}>
                        {item.href && !isLast ? (
                            <a
                                href={item.href}
                                className="hover:text-primary transition-colors"
                            >
                                {item.label}
                            </a>
                        ) : (
                            <span className={isLast ? "text-primary font-medium" : ""}>
                                {item.label}
                            </span>
                        )}

                        {!isLast && <span className="mx-1">/</span>}
                    </span>
                );
            })}
        </div>
    );
}
export default Breadcrumb;