// Función para generar un código de descuento único
function generateDiscountCode() {
    const minCode = 7368635;
    const maxCode = 9999999;
    const randomCode = Math.floor(Math.random() * (maxCode - minCode + 1)) + minCode;
    return String(randomCode).padStart(10, '0');
}

function spinWheel() {
    const wheel = document.getElementById("wheel");
    const resultElement = document.getElementById("result");

    // Generar un número aleatorio entre 1 y 6 (representando los segmentos en la ruleta)
    const randomSegment = Math.floor(Math.random() * 6) + 1;

    // Calcular el ángulo de rotación basado en el segmento aleatorio
    const angle = (randomSegment - 1) * 60 + 30; // 60 grados por segmento, con un desplazamiento de 30 grados

    // Desactivar el botón durante la animación
    document.querySelector("button").disabled = true;

    // Aplicar la animación de giro a la ruleta con una duración de transición más corta (3 segundos)
    wheel.style.transition = "transform 3s ease-out";
    wheel.style.transform = `rotate(${3600 + angle}deg)`; // Girar al ángulo calculado

    // Mostrar el resultado después de que termine la animación
    setTimeout(() => {
        const discounts = [1, 2, 3, 4, 5, 10];
        const discount = discounts[randomSegment - 1];

        const codigo = generateDiscountCode(); // Generar el código de descuento único
        console.log('Código de descuento generado:', codigo);

        resultElement.innerText = `¡Felicidades! Obtuviste un ${discount}% de descuento. Código: ${codigo}`;

        // Reiniciar la transición y la rotación después de mostrar el resultado
        wheel.style.transition = "none";
        wheel.style.transform = "rotate(0deg)";

        document.querySelector("button").disabled = false;

        // Enviar el código de descuento al mismo Google Sheets que el formulario
        sendDiscountToGoogleSheets(discount, codigo);

        // Redirigir al enlace proporcionado después de 6 segundos adicionales
        setTimeout(() => {
            window.location.href = 'https://jotart1991.github.io/BASE-DE-DATOS/';
        }, 4000); // Esperar 6 segundos adicionales
    }, 3000); // Esperar 3 segundos (duración de la animación)
}

async function sendDiscountToGoogleSheets(discount, codigo) {
    const data = {
        values: [[null, null, null, discount, codigo]] // Enviar descuento en la columna "D"
    };

    try {
        const response = await fetch('https://sheet.best/api/sheets/bb0442f7-2c73-45bd-a146-559bc90d02cb', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log('Respuesta del servidor (enviar código de descuento):', result);
    } catch (error) {
        console.error('Error al enviar el código de descuento:', error);
    }
}
