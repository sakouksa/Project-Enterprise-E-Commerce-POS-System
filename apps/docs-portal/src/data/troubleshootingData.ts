import { TroubleshootingItem } from '../types/docs';

export const TROUBLESHOOTING_ITEMS: TroubleshootingItem[] = [
  {
    id: 'err-401',
    code: 'HTTP 401 Unauthorized',
    title: 'JWT Access Token Expired or Missing',
    titleKh: 'កំហុស 401 Unauthorized — JWT Token ផុតកំណត់ ឬបាត់ Bearer Header',
    category: 'auth',
    problem: 'API requests fail with HTTP 401 response and message "Unauthenticated" or "Token has expired".',
    problemKh: 'សំណើ API ត្រូវបានបដិសេធជាមួយលេខកូដ 401 និងសារ "Unauthenticated" ឬ "Token has expired"។',
    cause: 'The short-lived JWT Access Token has exceeded its 15-minute expiration window, or the frontend request omitted the Authorization Bearer header.',
    causeKh: 'Access Token ផុតកំណត់រយៈពេល ១៥ នាទី ឬ Client ភ្លេចផ្ញើ Authorization: Bearer <token> ក្នុង HTTP Header។',
    howToCheck: 'Inspect the HTTP Request headers in Browser DevTools Network tab. Check if `Authorization: Bearer ...` is present and whether the response contains `{"message": "Unauthenticated"}`.',
    howToCheckKh: 'បើក Browser DevTools -> ផ្ទាំង Network -> មើល Header នៃ Request ថាតើមាន `Authorization: Bearer` ឬអត់។',
    solution: 'Trigger the POST /api/v1/auth/refresh endpoint using the stored refresh token to obtain a fresh access token without forcing the user to log in again.',
    solutionKh: 'ប្រើប្រាស់ Refresh Token ដើម្បីស្នើសុំ Access Token ថ្មីតាមរយៈ `POST /api/v1/auth/refresh` ដោយមិនបាច់ឱ្យអ្នកប្រើវាយពាក្យសម្ងាត់ម្តងទៀតឡើយ។',
    prevention: 'Ensure Axios / Dio HTTP interceptors automatically catch 401 status codes and perform token refresh before retrying the queued original request.',
    preventionKh: 'កំណត់ Axios Interceptor ឱ្យចាប់កំហុស 401 និងដំណើរការ Refresh Token ដោយស្វ័យប្រវត្តិតាមស្ថាបត្យកម្ម Silent Refresh។',
    codeSnippet: `// Axios Silent Refresh Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post('/api/v1/auth/refresh', {
          refresh_token: localStorage.getItem('refresh_token')
        });
        localStorage.setItem('access_token', data.access_token);
        originalRequest.headers['Authorization'] = 'Bearer ' + data.access_token;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);`
  },
  {
    id: 'err-403',
    code: 'HTTP 403 Forbidden',
    title: 'Insufficient Spatie Role or Permission',
    titleKh: 'កំហុស 403 Forbidden — គណនីគ្មានសិទ្ធិ (Missing Permission)',
    category: 'auth',
    problem: 'User receives HTTP 403 Forbidden with message "User does not have the right permissions".',
    problemKh: 'អ្នកប្រើប្រាស់ទទួលបានកំហុស 403 Forbidden មិនអាចមើល ឬចុចធ្វើសកម្មភាពបាន។',
    cause: 'The logged-in user\'s assigned role lacks the specific Spatie permission node (e.g. `purchase.approve` or `inventory.adjust`) required by the controller middleware.',
    causeKh: 'តួនាទីរបស់គណនីនោះមិនទាន់ត្រូវបានផ្តល់សិទ្ធិ (Permission Node) លើមុខងារនោះនៅឡើយ។',
    howToCheck: 'Check the route middleware in `backend/routes/api.php` for `permission:name.action` and verify user permissions in `model_has_permissions` table.',
    howToCheckKh: 'ពិនិត្យមើល Route Middleware ក្នុង `api.php` ថាតម្រូវឱ្យមានសិទ្ធិអ្វី រួចផ្ទៀងផ្ទាត់ក្នុង Roles & Permissions។',
    solution: 'Super Admin must navigate to Roles & Permissions in Admin Dashboard, edit the user\'s role, and check the required permission box.',
    solutionKh: 'Super Admin ត្រូវចូលទៅកាន់ Roles & Permissions រួចគូសធីកផ្តល់សិទ្ធិដែលខ្វះនោះជូនតួនាទីរបស់បុគ្គលិក។',
    prevention: 'Always verify permission matrices during role creation and avoid hardcoding role IDs directly in application logic.',
    preventionKh: 'ត្រូវរៀបចំ Role & Permission Matrix ឱ្យបានច្បាស់លាស់តាំងពីពេលបង្កើតតួនាទីដំបូង។'
  },
  {
    id: 'err-500-cors',
    code: 'CORS Policy Blocked',
    title: 'Cross-Origin Resource Sharing (CORS) Error',
    titleKh: 'កំហុស CORS Policy — Frontend មិនអាចទាក់ទង Backend បាន',
    category: 'network',
    problem: 'Browser console displays: "Access to XMLHttpRequest has been blocked by CORS policy: No \'Access-Control-Allow-Origin\' header is present".',
    problemKh: 'ផ្ទាំង Browser បង្ហាញកំហុស CORS មិនអនុញ្ញាតឱ្យ Frontend ទាញយកទិន្នន័យពី Backend។',
    cause: 'Frontend domain (e.g. `http://localhost:5173` or custom production domain) is not listed in Laravel `config/cors.php` `allowed_origins`.',
    causeKh: 'Domain របស់ Frontend មិនទាន់ត្រូវបានបញ្ចូលទៅក្នុងបញ្ជី `allowed_origins` ក្នុង `config/cors.php`។',
    howToCheck: 'Inspect CORS response headers in browser DevTools and check `backend/config/cors.php`.',
    howToCheckKh: 'ពិនិត្យមើលឯកសារ `backend/config/cors.php` ក្នុងផ្នែក `allowed_origins`។',
    solution: 'Add frontend URLs to `allowed_origins` or configure `FRONTEND_URL` in `.env`.',
    solutionKh: 'បញ្ចូល Domain Frontend ទៅក្នុង `allowed_origins` ក្នុង `backend/config/cors.php` ឬកំណត់ក្នុង `.env`។',
    prevention: 'Ensure environment variables for staging and production domains are defined in `config/cors.php`.',
    preventionKh: 'កំណត់អថេរ Environment សម្រាប់ Domain ផ្លូវការឱ្យបានត្រឹមត្រូវ។',
    codeSnippet: `// backend/config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => [
    env('FRONTEND_ADMIN_URL', 'http://localhost:5173'),
    env('FRONTEND_CUSTOMER_URL', 'http://localhost:5174'),
    env('DOCS_URL', 'http://localhost:5175'),
],
'allowed_headers' => ['*'],
'supports_credentials' => true,`
  },
  {
    id: 'err-stock-desync',
    code: 'Inventory Stock Desync',
    title: 'Physical Shelf Count Mismatch Against System Stock',
    titleKh: 'បញ្ហាស្តុកមិនស៊ីគ្នា — ចំនួនទំនិញលើធ្នើរខុសពីចំនួនក្នុងកុំព្យូទ័រ',
    category: 'inventory',
    problem: 'Warehouse physical inventory count does not match the quantities displayed on Admin Dashboard and POS terminal.',
    problemKh: 'ចំនួនទំនិញរាប់ជាក់ស្តែងក្នុងឃ្លាំងមិនត្រូវគ្នាជាមួយតួលេខក្នុងប្រព័ន្ធ។',
    cause: 'Unrecorded stock shrinkage (theft, expired goods, damaged items, or direct unapproved stock transfers).',
    causeKh: 'ទំនិញខូចខាត ឬបាត់បង់ដោយគ្មានការកត់ត្រា ឬការផ្ទេរទំនិញក្រៅប្រព័ន្ធ។',
    howToCheck: 'Navigate to Inventory -> Stock Movements and filter by product SKU to trace every single IN/OUT movement transaction.',
    howToCheckKh: 'ចូលទៅ Inventory -> Stock Movements រួចស្វែងរកតាម SKU ដើម្បីមើលប្រវត្តិទំនិញចេញ-ចូលគ្រប់ប្រតិបត្តិការ។',
    solution: 'Execute a physical Stock Opname cycle count session, scan all physical shelf items, and approve the discrepancy adjustment.',
    solutionKh: 'បង្កើតវគ្គរាប់ស្តុកជាក់ស្តែង (Stock Opname) ស្កេនទំនិញទាំងអស់ រួចអនុម័តការកែសម្រួលដើម្បីឱ្យតួលេខត្រឡប់មកត្រូវវិញ។',
    prevention: 'Conduct mandatory weekly or monthly Stock Opname cycle counts and enforce CCTV monitoring for warehouse loading docks.',
    preventionKh: 'ធ្វើការរាប់ស្តុកជាក់ស្តែងជាប្រចាំសប្តាហ៍ ឬខែ និងហាមឃាត់ការបញ្ចេញទំនិញដោយគ្មានប័ណ្ណត្រឹមត្រូវ។'
  },
  {
    id: 'err-flutter-network',
    code: 'Flutter Mobile API Connection Error',
    title: 'Mobile App Cannot Connect to Local Backend (Connection Refused)',
    titleKh: 'កំហុស Mobile App មិនអាចតភ្ជាប់ទៅកាន់ API ក្នុង Localhost',
    category: 'mobile',
    problem: 'Flutter mobile app running on Android emulator or physical device shows "DioException [connection error]: SocketException: Connection refused".',
    problemKh: 'Mobile App បង្ហាញកំហុសមិនអាចភ្ជាប់ទៅកាន់ Localhost របស់ម៉ាស៊ីនកុំព្យូទ័របាន។',
    cause: '`localhost` or `127.0.0.1` refers to the Android emulator itself, not the host machine running the Laravel backend.',
    causeKh: 'នៅក្នុង Android Emulator ពាក្យ `localhost` សំដៅលើទូរស័ព្ទផ្ទាល់ មិនមែនកុំព្យូទ័រដែលកំពុង Run Backend ឡើយ។',
    howToCheck: 'Check `mobile_app/lib/core/network/api_endpoints.dart` to verify `baseUrl`.',
    howToCheckKh: 'ពិនិត្យមើល `baseUrl` ក្នុង `api_endpoints.dart` របស់ Mobile App។',
    solution: 'Use `http://10.0.2.2:8000/api/v1` for Android Emulator, or your computer local LAN IP (e.g. `http://192.168.1.50:8000/api/v1`) for physical smartphone devices.',
    solutionKh: 'ប្តូរ Base URL ទៅជា `http://10.0.2.2:8000/api/v1` សម្រាប់ Android Emulator ឬប្រើ IP LAN កុំព្យូទ័រសម្រាប់ទូរស័ព្ទពិត។',
    prevention: 'Configure environment-based URL flavor injection in Flutter build commands.',
    preventionKh: 'ប្រើប្រាស់ Flutter Flavor ឬ Environment Configuration ដើម្បីកំណត់ URL តាមបរិស្ថាន Dev/Prod។'
  }
];
