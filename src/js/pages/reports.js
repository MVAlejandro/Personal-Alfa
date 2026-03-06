// Estilos generales
import '../../css/style.css'
import '../../css/pages/reports.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';

// Servicios Supabase
import { initPage } from '../utils/session-validate.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initPage()
});
