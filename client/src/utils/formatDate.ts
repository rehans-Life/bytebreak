const formatDate = (date: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en", options).format(new Date(date));
export default formatDate