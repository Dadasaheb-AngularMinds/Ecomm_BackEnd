const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[`~!@#$%^&*()\-_+={}[\]<,>.?/"'|\\;:])[\w`~!@#$%^&*()\-_+={}[\]<,.>?/"'|\\;:]{8,30}$/)) {
    return helpers.message('password must contain at least 1 capital letter,1 small letter, 1 number and 1 special character');
  }
  return value;
};

const checkWhiteSpaceInMasterName=(value, helpers) => {

  if(!value.trim()){
    return helpers.message('Master name must be contain 1 character');

  }
  return value;
}



module.exports = {
  objectId,
  password,
  checkWhiteSpaceInMasterName
};
