import React, { useEffect, useState } from 'react';

const API_URL = 'https://backendfinal-3.onrender.com/proyecto';

export const App = () => {
  const [proyectos, setProyectos] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [completada, setCompletada] = useState(false);
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [prioridad, setPrioridad] = useState('media');
  const [asignadoA, setAsignadoA] = useState('');
  const [categoria, setCategoria] = useState('');
  const [costoProyecto, setCostoProyecto] = useState('');
  const [idEditando, setIdEditando] = useState(null);

  // Obtener proyectos al cargar el componente
  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setProyectos(data);
      } catch (error) {
        console.error('Error al obtener proyectos:', error);
      }
    };

    fetchProyectos();
  }, []);

  // Crear o actualizar proyecto
  const manejarSubmit = async (e) => {
    e.preventDefault();

    const nuevoProyecto = {
      titulo,
      descripcion,
      completada,
      fecha_vencimiento: fechaVencimiento,
      prioridad,
      asignado_a: asignadoA,
      categoria,
      Costo_proyecto: parseFloat(costoProyecto),
    };

    try {
      if (idEditando) {
        await fetch(`${API_URL}/${idEditando}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoProyecto),
        });
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nuevoProyecto),
        });
      }

      // Limpiar el formulario
      setTitulo('');
      setDescripcion('');
      setCompletada(false);
      setFechaVencimiento('');
      setPrioridad('media');
      setAsignadoA('');
      setCategoria('');
      setCostoProyecto('');
      setIdEditando(null);

      // Refrescar la lista de proyectos
      const response = await fetch(API_URL);
      const data = await response.json();
      setProyectos(data);
    } catch (error) {
      console.error('Error al guardar el proyecto:', error);
    }
  };

  // Editar proyecto
  const editarProyecto = (proyecto) => {
    setTitulo(proyecto.titulo);
    setDescripcion(proyecto.descripcion);
    setCompletada(proyecto.completada);
    setFechaVencimiento(proyecto.fecha_vencimiento);
    setPrioridad(proyecto.prioridad);
    setAsignadoA(proyecto.asignado_a);
    setCategoria(proyecto.categoria);
    setCostoProyecto(proyecto.Costo_proyecto);
    setIdEditando(proyecto.id_proyecto);
  };

  // Eliminar proyecto
  const eliminarProyecto = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      const response = await fetch(API_URL);
      const data = await response.json();
      setProyectos(data);
    } catch (error) {
      console.error('Error al eliminar el proyecto:', error);
    }
  };

  // Función para manejar el pago
  const handlePayment = async (id_proyecto) => {
    try {
      const response = await fetch('https://backendfinal-3.onrender.com/proyecto/pago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_proyecto }),
      });

      if (!response.ok) {
        throw new Error('Error al procesar el pago');
      }

      const session = await response.json();
      console.log('Pago procesado con éxito:', session);
      // Aquí podrías redirigir al usuario a una página de éxito o mostrar un mensaje
    } catch (error) {
      console.error('Error al manejar el pago:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Gestión de Proyectos</h1>

      <div className='d-flex justify-content-center mt-5'>
        <div className='col-6'>
          <form onSubmit={manejarSubmit} className="mb-4">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                checked={completada}
                onChange={() => setCompletada(!completada)}
              />
              <label className="form-check-label">Completada</label>
            </div>
            <div className="mb-3">
              <input
                type="date"
                className="form-control"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <select
                className="form-select"
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value)}
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Asignado a"
                value={asignadoA}
                onChange={(e) => setAsignadoA(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Categoría"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="Costo del Proyecto"
                value={costoProyecto}
                onChange={(e) => setCostoProyecto(e.target.value)}
                step="0.01"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {idEditando ? 'Actualizar' : 'Crear'}
            </button>
          </form>
        </div>
      </div>

      <h2>Lista de Proyectos</h2>
      <div className="row">
        {proyectos.map((proyecto) => (
          <div key={proyecto.id_proyecto} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">{proyecto.titulo}</h3>
                <p className="card-text">{proyecto.descripcion}</p>
                <p>Estado: {proyecto.completada ? 'Completada' : 'No completada'}</p>
                <p>Fecha de Vencimiento: {proyecto.fecha_vencimiento}</p>
                <p>Prioridad: {proyecto.prioridad}</p>
                <p>Asignado a: {proyecto.asignado_a}</p>
                <p>Categoría: {proyecto.categoria}</p>
                <p>Costo: ${proyecto.Costo_proyecto?.toFixed(2)}</p>
                <button onClick={() => editarProyecto(proyecto)} className="btn btn-warning btn-sm me-2">
                  Editar
                </button>
                <button onClick={() => eliminarProyecto(proyecto.id_proyecto)} className="btn btn-danger btn-sm me-2">
                  Eliminar
                </button>
                <button onClick={() => handlePayment(proyecto.id_proyecto)} className="btn btn-success btn-sm">
                  Pagar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
