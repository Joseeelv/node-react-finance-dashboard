export default function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow">
        <img className="w-16 h-16 mx-auto" src="/finance.svg" alt="Logo" />
        <h2 className="text-2xl font-bold text-center">Registrarse</h2>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring focus:border-blue-300"
              placeholder="nombre de usuario"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring focus:border-blue-300"
              placeholder="ejemplo@dominio.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring focus:border-blue-300"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300 cursor-pointer"
          >
            Registrarse
          </button>
        </form>
        <div className="text-sm text-center">
          ¿No tienes una cuenta?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Inicia Sesión
          </a>
        </div>
      </div>
    </div>
  );
}
