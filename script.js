const appScriptURL = 'https://script.google.com/macros/s/AKfycbzpS2DzaZ6NvphaTysjo0gyK5ALV-0b9GHvTazhnCfxTmG8jC6YYEgDjamfecEr_kE/exec'; 

// https://issay22.github.io/Invitacion_Boda_Karina_Kevin/?i=REYNA

document.addEventListener('DOMContentLoaded', () => {

    const siBtnForm = document.getElementById('siconfirmo');
    const cierraFormSi = document.getElementById('cerrarModal');
    const abreFormSi = document.getElementById('confirmoModal'); 
    const btnNoEnviar = document.getElementById('btn-no-enviar');
    const camposContainer = document.getElementById('camposInvitadosContainer');
    const campoTemplate = document.getElementById('campoTemplate');
    const invitacionForm = document.getElementById('invitacionForm');
    const elNombrePrincipal = document.getElementById('nombreinvitado');
    const btnEnviar = document.getElementById('btn-si-enviar');

    // ---  open modal ---
    siBtnForm.addEventListener('click', () => {
        abreFormSi.showModal();
    });

    cierraFormSi.addEventListener('click', () => {
        abreFormSi.close();
        invitacionForm.reset();
    });
    
     // ---  Pural ---
    function actualizarTextoPorPases() {
        const npases = document.getElementById('npases').textContent;
        const ess = document.getElementById('ess');
        const es = document.getElementById('es');
        if (parseInt(npases) === 1) {
            if (ess) ess.style.display = 'none';
            if (es) es.style.display = 'none';
        } else {
            if (ess) ess.style.display = 'inline';
            if (es) es.style.display = 'inline';
        }
    }


    // ---  Preguntr antes de enviar el form ---
    btnEnviar.addEventListener('click', function(event) {
        
        event.preventDefault(); 
        
        if (typeof abreFormSi !== 'undefined' && abreFormSi.close) {
             abreFormSi.close();
        }

        const confirmacion = confirm("¿Estás seguro de que deseas confirmar la asistencia con estos nombres?");
        
        
        if (!confirmacion) {
            // Si cancela
            if (typeof abreFormSi !== 'undefined' && abreFormSi.showModal) {
                 abreFormSi.showModal();
            }
        } else {
            // Si acepta se envía
            console.log("Confirmación aceptada, listos para enviar a Google Sheets...");

            const confirmInput = document.getElementById('confirm');
            if (confirmInput) {
                confirmInput.value = "Sí";
            }
            
            const formData = new FormData(invitacionForm);

            fetch(appScriptURL, {
                method: 'POST', 
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error de red al conectar con el Apps Script.');
                }
                return response.json(); 
            })
            .then(data => {
                console.log('Respuesta de Google Sheets:', data);
                if (data.result === 'success') {
                    alert('¡Asistencia confirmada con éxito! Gracias por tu respuesta.');
                    
                    // reset modal - cambiar nombre - deshabilitar
                    invitacionForm.reset(); 
                    guardarEstadoConfirmacion('confirmado')
                    siBtnForm.textContent = 'Asistencia Confirmada';
                    btnNoEnviar.textContent = '-';
                    siBtnForm.disabled = true;
                    btnNoEnviar.disabled = true;

                } else {
                    alert('Hubo un error al confirmar la asistencia. Inténtalo de nuevo o contacta al administrador.');
                    console.error('Error del Apps Script:', data.error);
                }
            })
            .catch(error => {
                console.error('Error al enviar los datos:', error);
                alert('Error de conexión. Por favor, revisa tu conexión a internet e inténtalo de nuevo.');
            });
        }

    });

    btnNoEnviar.addEventListener('click', function(event) {

        event.preventDefault(); 
        const confirmacion = confirm("¿Estás seguro de no ir a nuestra boda? D:");

        if (!confirmacion) {
            
        } else {

            console.log("Cancelación aceptada, enviando 'No' a Google Sheets...");

            const guestIdInput = document.getElementById('guestId');
            const guestIdValue = guestIdInput ? guestIdInput.value : '';

            const formDataNo = new FormData();
            formDataNo.append('guestId', guestIdValue); 
            formDataNo.append('confirm', 'No'); 
            
            fetch(appScriptURL, {
                method: 'POST', 
                body: formDataNo
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error de red al conectar con el Apps Script.');
                }
                return response.json(); 
            })
            .then(data => {
                console.log('Respuesta de Google Sheets (No Confirmar):', data);
                if (data.result === 'success') {
                    
                    alert("Su cancelación se ha registrado correctamente. :'( ");
                    guardarEstadoConfirmacion('cancelado');
                    btnNoEnviar.textContent = 'Inasistencia Confirmada';
                    siBtnForm.textContent = '-';
                    siBtnForm.disabled = true;
                    btnNoEnviar.disabled = true;

                } else {
                    alert('Hubo un error al enviar tu cancelación. Por favor, inténtalo de nuevo.');
                    console.error('Error del Apps Script:', data.error);
                }
            })
            .catch(error => {
                console.error('Error al enviar los datos:', error);
                alert('Error de conexión. Por favor, revisa tu conexión a internet e inténtalo de nuevo.');
            });
        }
    });

    //Local storage para las respuestas?

    function guardarEstadoConfirmacion(estado) {
        const guestIdInput = document.getElementById('guestId');
        const guestCode = guestIdInput ? guestIdInput.value : '';
        
        if (guestCode) {
            localStorage.setItem(`confirmStatus_${guestCode}`, estado);
            console.log(`Estado '${estado}' guardado para el invitado: ${guestCode}`);
        }
    }

    function cargarEstadoConfirmacion() {
        const guestIdInput = document.getElementById('guestId');
        const guestCode = guestIdInput ? guestIdInput.value : null;

        if (guestCode) {
            const estadoGuardado = localStorage.getItem(`confirmStatus_${guestCode}`);
            
            if (estadoGuardado) {
                console.log(`Estado guardado encontrado: ${estadoGuardado}. Aplicando cambios...`);
                
                if (estadoGuardado === 'confirmado') {
                    siBtnForm.textContent = 'Ya confirmaste tu asistencia';
                    btnNoEnviar.textContent = '-';
                    siBtnForm.disabled = true;
                    btnNoEnviar.disabled = true;

                } else if (estadoGuardado === 'cancelado') {
                    btnNoEnviar.textContent = 'Ya confirmaste tu inasistencia';
                    siBtnForm.textContent = '-';
                    siBtnForm.disabled = true;
                    btnNoEnviar.disabled = true;
                }
            } else {
                console.log('No se encontró estado guardado para este invitado.');
            }
        }
    }


    // --- Cargar .Json y Generar Campos ---
    async function loadInvitacion() {
        try {
            const response = await fetch('data.json');
            const guestsData = await response.json();

            const urlParams = new URLSearchParams(window.location.search);
            const guestCode = urlParams.get('i'); 

            if (guestCode && guestsData[guestCode]) {
                const guestInfo = guestsData[guestCode];

                if (elNombrePrincipal) elNombrePrincipal.textContent = guestInfo.nombre;

                document.getElementById('nomtituinvi').value = guestInfo.nombre;
                document.getElementById('npases').textContent = guestInfo.pases; 
                document.getElementById('mensaje').textContent = guestInfo.mensajeEspecial; 

                document.getElementById('guestId').value = guestCode;
                
                generarCamposInvitados(guestInfo.pases, guestInfo.nombre);
                actualizarTextoPorPases();
                cargarEstadoConfirmacion();

            } else {
                if (elNombrePrincipal) elNombrePrincipal.textContent = 'Estimado invitado no estas identificado, contáctanos por favor.';
            }
        } catch (error) {
            console.error("Error al cargar los datos de invitación:", error);
        }
    }

    //----------------------------------------------------------- BORRAR -------------------------------------------------------------------
    // --- FUNCIÓN TEMPORAL DE RESET ---
    function resetearLocalStorage() {
        const guestIdInput = document.getElementById('guestId');
        const guestCode = guestIdInput ? guestIdInput.value : '';

        if (guestCode) {
            const claveConfirmacion = `confirmStatus_${guestCode}`;
            
            // 1. Borrar la clave específica del invitado
            localStorage.removeItem(claveConfirmacion);
            
            // 2. Notificar y restaurar la UI
            alert(`Memoria local de la confirmación borrada para el invitado: ${guestCode}.`);
            
            // 3. Restaurar los botones a su estado original
            siBtnForm.textContent = '¡Sí Confirmo!';
            siBtnForm.disabled = false;
            btnNoEnviar.textContent = 'No puedo asistir';
            btnNoEnviar.disabled = false;
            
            // 4. Asegurarse de que el formulario esté reseteado (opcional, pero buena práctica)
            invitacionForm.reset(); 
            
            console.log(`Clave '${claveConfirmacion}' eliminada de localStorage.`);
            
        } else {
            alert("No se ha podido obtener el guestId para resetear la memoria.");
        }
    }

    // --- EVENT LISTENER PARA EL BOTÓN TEMPORAL ---
    const resetLocalStorageBtn = document.getElementById('resetLocalStorageBtn');
    if (resetLocalStorageBtn) {
        resetLocalStorageBtn.addEventListener('click', resetearLocalStorage);
    }
    //----------------------------------------------------------- BORRAR -------------------------------------------------------------------

    function generarCamposInvitados(numPases, nombrePrincipal) {
        camposContainer.innerHTML = '';

        const pasesAImprimir = Math.min(numPases, 5); // Limite a 5 invitacions

        for (let i = 1; i <= pasesAImprimir; i++) {
            const nuevoCampoSection = campoTemplate.cloneNode(true);
            nuevoCampoSection.style.display = 'block'; 
            
            const inputElement = nuevoCampoSection.querySelector('input');
            const labelElement = nuevoCampoSection.querySelector('label');

            inputElement.id = `txtnombre${i}`; 
            inputElement.name = `invitado${i}`; 
            
            labelElement.setAttribute('for', `txtnombre${i}`); 
            labelElement.textContent = `Invitado ${i}`;

            //rellenar el primer campo al nombre del invitado
            if (i === 1 && nombrePrincipal) {
                inputElement.value = nombrePrincipal;
            }

            camposContainer.appendChild(nuevoCampoSection);
        }
    }

    // --- carga todo ---
    //loadInvitacion();
    generarCamposInvitados(3, 'Prueba Nombre Invitado Principal'); 
    actualizarTextoPorPases();
});

//Reloj
document.addEventListener('DOMContentLoaded', () => {    
    
    const fechaBoda = new Date("Feb 21, 2026 16:00:00").getTime();

    let intervalo;

    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = text;
    };

    const actualizarReloj = () => {
        const hoy = Date.now(); 
        let falta = fechaBoda - hoy;

        if (falta < 0) {
            clearInterval(intervalo);
            document.getElementById("dia").innerHTML = "¡";
            document.getElementById("hr").innerHTML = "YA";
            document.getElementById("min").innerHTML = "LLE";
            document.getElementById("seg").innerHTML = "GÓ!";
            return;
        }

        const segundo = 1000;
        const minuto = segundo * 60;
        const hora = minuto * 60;
        const dia = hora * 24;

        const diaF = Math.floor(falta / dia);
        const hrF = Math.floor((falta % dia) / hora);
        const minF = Math.floor((falta % hora) / minuto);
        const segF = Math.floor((falta % minuto) / segundo);

        document.getElementById("dia").innerHTML = diaF;
        document.getElementById("hr").innerHTML = String(hrF).padStart(2, "0");
        document.getElementById("min").innerHTML = String(minF).padStart(2, "0");
        document.getElementById("seg").innerHTML = String(segF).padStart(2, "0");

    };

    actualizarReloj(); 
    intervalo = setInterval(actualizarReloj, 1000); 
});

// animaciones

document.addEventListener('DOMContentLoaded', () => {
    const elementosAnimar = document.querySelectorAll('.animarAlBajar');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elementosAnimar.forEach(el => {
        observer.observe(el);
    });
});