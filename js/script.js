document.addEventListener('DOMContentLoaded', () => {
  const botonCorreo = document.getElementById('boton-correo');

  botonCorreo.addEventListener('click', () => {
    const correo = 'malomu95@gmail.com';
    
    navigator.clipboard.writeText(correo).then(() => {
      const popUp = document.createElement('div');
      popUp.className = 'pop-up-copiado mostrar';
      popUp.textContent = `${correo} ha sido copiado al portapapeles`;
      document.body.appendChild(popUp);

      // Esperar a que el navegador pinte el elemento
      requestAnimationFrame(() => {
        const rect = botonCorreo.getBoundingClientRect();
        popUp.style.left = `${rect.left + rect.width / 2 - popUp.offsetWidth / 2}px`;
        popUp.style.top = `${rect.top - popUp.offsetHeight - 10}px`;
      });

      setTimeout(() => {
        popUp.remove();
      }, 2000);
    });
  });
});

let proyectosData = [];
let tecnologiasUnicas = new Set();

function renderProyectos(filtro = null) {
  const contenedor = document.getElementById("lista-proyectos");
  contenedor.innerHTML = "";

  const proyectosFiltrados = filtro
    ? proyectosData.filter(p => p.tecnologias.includes(filtro))
    : proyectosData;

  proyectosFiltrados.forEach(proyecto => {
    const card = document.createElement("div"); 
    card.className = "proyecto-card";
    card.innerHTML = `
      <img src="${proyecto.imagen}" alt="${proyecto.titulo}">
      <h3>${proyecto.titulo}</h3>
      <p>${proyecto.descripcion}</p>
      <div class="tags">
        ${proyecto.tecnologias.map(t => `<span class="tag">${t}</span>`).join("")}
      </div>
      ${
        proyecto.github
          ? `<a href="${proyecto.github}" target="_blank">Ver código en GitHub</a>`
          : `<span class="confidencial">Código no disponible por confidencialidad</span>`
      }
    `;
    contenedor.appendChild(card);
  });
}

function renderFiltros() {
  const filtros = document.getElementById("filtros-proyectos");
  filtros.innerHTML = `<button data-tec="">Todos</button>`;
  tecnologiasUnicas.forEach(tec => {
    filtros.innerHTML += `<button data-tec="${tec}">${tec}</button>`;
  });

  filtros.addEventListener("click", e => {
    if (e.target.tagName === "BUTTON") {
      const filtro = e.target.dataset.tec || null;
      renderProyectos(filtro);
    }
  });
}

// Cargar proyectos
fetch("../json/proyectos.json")
  .then(res => res.json())
  .then(data => {
    proyectosData = data;
    data.forEach(p => p.tecnologias.forEach(t => tecnologiasUnicas.add(t)));
    renderFiltros();
    renderProyectos();
  });