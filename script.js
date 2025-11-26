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



// https://issay22.github.io/Invitacion_Boda_Karina_Kevin/?invitado=REYNA

async function loadInvitacion() {
   
    const response = await fetch('data.json');
    const guestsData = await response.json();

    const urlParams = new URLSearchParams(window.location.search);
    const guestCode = urlParams.get('invitado');

    if (guestCode && guestsData[guestCode]) {
        const guestInfo = guestsData[guestCode];

        document.getElementById('nombreinvitado').textContent = guestInfo.nombre;
        document.getElementById('npases').textContent = guestInfo.pases;
        
        document.getElementById('mensaje').textContent = guestInfo.mensajeEspecial;

    } else {
        document.getElementById('nombreinvitado').textContent = 'Estimado invitado no estas identificado, contáctanos por favor.';
        document.getElementById('invitacionoracion').textContent = 'No identificado';
    }

    const actualizarTexto = () => {
        const unaS = document.getElementById('ess');
        const unaP = document.getElementById('es');
        const npasesEl = document.getElementById('npases');

        if (parseInt(npasesEl.textContent) <= 1) {
            unaS.textContent = '';
            unaP.textContent = '';
        } else {
            unaS.textContent = 'es';
            unaP.textContent = 's';
        }
    };

    actualizarTexto();  
}



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



