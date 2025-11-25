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



// https://issay22.github.io/Invitacion_Boda_Karina_-_Kevin/?invitado=REYNA

async function loadInvitacion() {
    // 1. Cargar los datos de invitados desde el archivo JSON
    const response = await fetch('data.json');
    const guestsData = await response.json();

    // 2. Leer el código de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const guestCode = urlParams.get('invitado');

    // 3. Modificar la interfaz
    if (guestCode && guestsData[guestCode]) {
        const guestInfo = guestsData[guestCode];

        document.getElementById('nombreinvitado').textContent = guestInfo.nombre;
        document.getElementById('npases').textContent = guestInfo.pases;
        // Muestra el mensaje especial también
        document.getElementById('mensaje').textContent = guestInfo.mensajeEspecial;

    } else {
        // En caso de que alguien entre sin el enlace correcto
        document.getElementById('nombreinvitado').textContent = 'Estimado invitado no estas identificado, contáctanos por favor.';
        document.getElementById('invitacionoracion').textContent = 'No identificado';
    }
}

document.addEventListener('DOMContentLoaded', loadInvitacion);



// animaciones
document.addEventListener('DOMContentLoaded', () => {
    const elementosAnimar = document.querySelectorAll('.animate-on-scroll');

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