const checkMobile = mobile => {
  let reg = /^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/;
  if (!mobile.length) {
    return false;
  } else if (!reg.test(mobile) || mobile.length !== 11) {
    return false;
  } else {
    return true;
  }
}

module.exports = {
  checkMobile
}
