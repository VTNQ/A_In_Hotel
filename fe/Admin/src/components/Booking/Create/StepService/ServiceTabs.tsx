
const ServiceTabs = ({ value, onChange, categories }: any) => {
    const serviceTabs = [
        { label: "All Services", value: "" },
        ...categories.map((c: any) => ({
            label: c.name,
            value: c.id,
        })),
    ];

    return (
        <div className="flex gap-2">
            {serviceTabs.map((t) => (
                <button
                    key={t.value}
                    onClick={() => onChange(t.value)}
                    className={`px-4 py-1.5 rounded-full text-sm ${value === t.value
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    {t.label}
                </button>
            ))}
        </div>
    )
}

export default ServiceTabs;