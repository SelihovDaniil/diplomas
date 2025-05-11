export const dataTypes: { [k: string]: string } = {
  string: "Строка",
  number: "Число",
  boolean: "Да/Нет",
  date: "Дата",
};

export const renderElement = (
  schema: { name: string; dataType: string }[],
  key: string,
  value: any
) => {
  const dataType = schema.find((el) => el.name === key)?.dataType;
  if (!dataType) return value;
  switch (dataType) {
    case "string":
      return value;
    case "number":
      return value;
    case "boolean":
      return value ? "Да" : "Нет";
    case "date":
      return value.toLocaleString("ru");
    default:
      return value;
  }
};

export const generateDefaultValues = (
  schema: { name: string; dataType: string }[]
): Record<string, any> => {
  const defaults: Record<string, any> = {};

  for (const field of schema) {
    switch (field.dataType) {
      case "string":
        defaults[field.name] = "";
        break;
      case "number":
        defaults[field.name] = undefined;
        break;
      case "boolean":
        defaults[field.name] = false;
        break;
      case "date":
        defaults[field.name] = null;
        break;
      default:
        defaults[field.name] = undefined;
    }
  }

  return defaults;
};
