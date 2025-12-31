interface PropertiesActionProps {
  text: string;
}

const PropertiesAction = ({ text }: PropertiesActionProps) => {
  return <h2 className="font-montserrat font-semibold text-sm">{text}</h2>;
};

export default PropertiesAction;
