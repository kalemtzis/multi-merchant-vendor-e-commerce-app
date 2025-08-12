interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CategoriesSidebar = ({ open, onOpenChange }: Props) => {
  return <div className="hidden">CategoriesSidebar</div>;
};

export default CategoriesSidebar;
