export default (templateData, templateHTML) => {
  Object.keys(templateData).forEach(key => {
    const regexp = new RegExp(`{{${key}}}`, 'g');
    templateHTML = templateHTML.replace(regexp, templateData[key]);
  });
  return templateHTML;
};
