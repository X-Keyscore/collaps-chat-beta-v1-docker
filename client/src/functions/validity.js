module.exports = {
  validityPseudo: function (pseudo) {
    const x = pseudo.length
    switch (true) {
      case (x === 0):
        return {warning: "", valid: false}
      case (x < 3):
        return {warning: "Trop court", valid: false}
      case (x > 32):
        return {warning: "Trop long", valid: false}
      default:
        return {warning: "", valid: true}
    }
  },
  validityPassword: function (password) {
    const x = password.length
    switch (true) {
      case (x === 0):
        return {warning: "", valid: false}
      case (x < 6):
        return {warning: "Trop court", valid: false}
      case (x > 32):
        return {warning: "Trop long", valid: false}
      default:
        return {warning: "", valid: true}
    }
  },
  validityPasswordConfirm: function (passwordConfirm, password) {
    const passwordConfirmTextLength = passwordConfirm.length
    const passwordConfirmValue = passwordConfirm
    switch (true) {
      case (passwordConfirmTextLength === 0):
        return {warning: "", valid: false}
      case (passwordConfirmValue !== password):
        return {warning: "Incorrect", valid: false}
      default:
        return {warning: "", valid: true}
    }
  },
  validityPasswordConfirmForPassword: function (passwordConfirm, passwordValue) {
    const passwordConfirmTextLength = passwordConfirm.length
    const passwordConfirmValue = passwordConfirm
    switch (true) {
      case (passwordConfirmTextLength === 0):
        return {warning: "", valid: false}
      case (passwordConfirmValue !== passwordValue):
        return {warning: "Le mot de passe ne corrrespond pas", valid: false}
      default:
        return {warning: "", valid: true}
    }
  }
};