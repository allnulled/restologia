
window.$Notificaciones = class {constructor(componenteNotificaciones){this.componente = componenteNotificaciones;}
error(error, trace = undefined){this.componente.addNotification({type:"error", name:error.name, message:error.message, trace:trace});}
mensaje(mensaje){console.log(mensaje);}};