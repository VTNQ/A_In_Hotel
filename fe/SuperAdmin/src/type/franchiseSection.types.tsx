export interface FranchiseSection {
  id: number;
  code: string;
  title: string;
  subTitle: string;
  description: string;
  sortOrder: number;
  active: boolean;
}
export interface FranchiseSectionTableProps {
  rows: FranchiseSection[];
  loading: boolean;
  sortKey: keyof FranchiseSection | null;
  sortDir: "asc" | "desc";
  onSortChange: (key: keyof FranchiseSection) => void;
  page: number;
  pageSize: number;
  onEdit: (row: FranchiseSection) => void;
  total: number;
  onActive?: (franchiseSection: FranchiseSection) => void;
  onDeactivate?: (franchiseSection: FranchiseSection) => void;
  onPageChange: (page: number) => void;
}
export interface FranchiseSectionFilterProps {
  search: string;
  onSearchChange: (v: string) => void;
}
export interface FranchiseSectionEditProps {
  open: boolean;
  franchiseSectionId: number | null;
  onClose: () => void;
  onSubmit: () => void;
}
export interface FranchiseSectionMenuProps {
  franchiseSection: FranchiseSection;
  onEdit?: (franchiseSection: FranchiseSection) => void;
  onActive?: (franchiseSection: FranchiseSection) => void;
  onDeactivate?: (franchiseSection: FranchiseSection) => void;
}
