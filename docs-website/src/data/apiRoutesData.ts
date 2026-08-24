import { ApiEndpoint } from '../types/docs';

export const API_ROUTES: ApiEndpoint[] = [
  {
    "id": "api-1",
    "module": "health",
    "method": "GET",
    "path": "/api/health",
    "summary": "GET endpoint for health check",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ health (check)",
    "controller": "HealthController",
    "action": "check",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-2",
    "module": "activity-logs",
    "method": "GET",
    "path": "/api/v1/activity-logs",
    "summary": "GET endpoint for activity-logs index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ activity-logs (index)",
    "controller": "ActivityLogController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-3",
    "module": "activity-logs",
    "method": "GET",
    "path": "/api/v1/activity-logs/dashboard",
    "summary": "GET endpoint for activity-logs dashboard",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ activity-logs (dashboard)",
    "controller": "ActivityLogController",
    "action": "dashboard",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-4",
    "module": "activity-logs",
    "method": "GET",
    "path": "/api/v1/activity-logs/{id}",
    "summary": "GET endpoint for activity-logs show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ activity-logs (show)",
    "controller": "ActivityLogController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-5",
    "module": "activity-logs",
    "method": "DELETE",
    "path": "/api/v1/activity-logs/{id}",
    "summary": "DELETE endpoint for activity-logs destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ activity-logs (destroy)",
    "controller": "ActivityLogController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-6",
    "module": "attendance",
    "method": "GET",
    "path": "/api/v1/attendance",
    "summary": "GET endpoint for attendance index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attendance (index)",
    "controller": "AttendanceController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-7",
    "module": "attendance",
    "method": "POST",
    "path": "/api/v1/attendance",
    "summary": "POST endpoint for attendance store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attendance (store)",
    "controller": "AttendanceController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-8",
    "module": "attendance",
    "method": "POST",
    "path": "/api/v1/attendance/bulk-delete",
    "summary": "POST endpoint for attendance bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attendance (bulkDelete)",
    "controller": "AttendanceController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-9",
    "module": "attendance",
    "method": "GET",
    "path": "/api/v1/attendance/dashboard-stats",
    "summary": "GET endpoint for attendance dashboardStats",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attendance (dashboardStats)",
    "controller": "AttendanceController",
    "action": "dashboardStats",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-10",
    "module": "attendance",
    "method": "GET",
    "path": "/api/v1/attendance/export",
    "summary": "GET endpoint for attendance export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attendance (export)",
    "controller": "AttendanceController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-11",
    "module": "attendance",
    "method": "POST",
    "path": "/api/v1/attendance/generate-qr",
    "summary": "POST endpoint for attendance generateQr",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attendance (generateQr)",
    "controller": "AttendanceController",
    "action": "generateQr",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-12",
    "module": "attendance",
    "method": "POST",
    "path": "/api/v1/attendance/import",
    "summary": "POST endpoint for attendance import",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attendance (import)",
    "controller": "AttendanceController",
    "action": "import",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-13",
    "module": "attendance",
    "method": "POST",
    "path": "/api/v1/attendance/scan-qr",
    "summary": "POST endpoint for attendance scanQr",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attendance (scanQr)",
    "controller": "AttendanceController",
    "action": "scanQr",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-14",
    "module": "attendance",
    "method": "GET",
    "path": "/api/v1/attendance/{attendance}",
    "summary": "GET endpoint for attendance show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attendance (show)",
    "controller": "AttendanceController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-15",
    "module": "attendance",
    "method": "PUT",
    "path": "/api/v1/attendance/{attendance}",
    "summary": "PUT endpoint for attendance update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attendance (update)",
    "controller": "AttendanceController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-16",
    "module": "attendance",
    "method": "DELETE",
    "path": "/api/v1/attendance/{attendance}",
    "summary": "DELETE endpoint for attendance destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attendance (destroy)",
    "controller": "AttendanceController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-17",
    "module": "attendances",
    "method": "GET",
    "path": "/api/v1/attendances",
    "summary": "GET endpoint for attendances index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attendances (index)",
    "controller": "AttendanceController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-18",
    "module": "attendances",
    "method": "POST",
    "path": "/api/v1/attendances",
    "summary": "POST endpoint for attendances store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attendances (store)",
    "controller": "AttendanceController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-19",
    "module": "attendances",
    "method": "POST",
    "path": "/api/v1/attendances/bulk-delete",
    "summary": "POST endpoint for attendances bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attendances (bulkDelete)",
    "controller": "AttendanceController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-20",
    "module": "attendances",
    "method": "GET",
    "path": "/api/v1/attendances/dashboard-stats",
    "summary": "GET endpoint for attendances dashboardStats",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attendances (dashboardStats)",
    "controller": "AttendanceController",
    "action": "dashboardStats",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-21",
    "module": "attendances",
    "method": "GET",
    "path": "/api/v1/attendances/export",
    "summary": "GET endpoint for attendances export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attendances (export)",
    "controller": "AttendanceController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-22",
    "module": "attendances",
    "method": "POST",
    "path": "/api/v1/attendances/generate-qr",
    "summary": "POST endpoint for attendances generateQr",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attendances (generateQr)",
    "controller": "AttendanceController",
    "action": "generateQr",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-23",
    "module": "attendances",
    "method": "POST",
    "path": "/api/v1/attendances/import",
    "summary": "POST endpoint for attendances import",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attendances (import)",
    "controller": "AttendanceController",
    "action": "import",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-24",
    "module": "attendances",
    "method": "POST",
    "path": "/api/v1/attendances/scan-qr",
    "summary": "POST endpoint for attendances scanQr",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attendances (scanQr)",
    "controller": "AttendanceController",
    "action": "scanQr",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-25",
    "module": "attendances",
    "method": "GET",
    "path": "/api/v1/attendances/{attendance}",
    "summary": "GET endpoint for attendances show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attendances (show)",
    "controller": "AttendanceController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-26",
    "module": "attendances",
    "method": "PUT",
    "path": "/api/v1/attendances/{attendance}",
    "summary": "PUT endpoint for attendances update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attendances (update)",
    "controller": "AttendanceController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-27",
    "module": "attendances",
    "method": "DELETE",
    "path": "/api/v1/attendances/{attendance}",
    "summary": "DELETE endpoint for attendances destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attendances (destroy)",
    "controller": "AttendanceController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-28",
    "module": "attribute-values",
    "method": "GET",
    "path": "/api/v1/attribute-values",
    "summary": "GET endpoint for attribute-values index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attribute-values (index)",
    "controller": "AttributeValueController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-29",
    "module": "attribute-values",
    "method": "POST",
    "path": "/api/v1/attribute-values",
    "summary": "POST endpoint for attribute-values store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attribute-values (store)",
    "controller": "AttributeValueController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-30",
    "module": "attribute-values",
    "method": "GET",
    "path": "/api/v1/attribute-values/{attribute_value}",
    "summary": "GET endpoint for attribute-values show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attribute-values (show)",
    "controller": "AttributeValueController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-31",
    "module": "attribute-values",
    "method": "PUT",
    "path": "/api/v1/attribute-values/{attribute_value}",
    "summary": "PUT endpoint for attribute-values update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attribute-values (update)",
    "controller": "AttributeValueController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-32",
    "module": "attribute-values",
    "method": "DELETE",
    "path": "/api/v1/attribute-values/{attribute_value}",
    "summary": "DELETE endpoint for attribute-values destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attribute-values (destroy)",
    "controller": "AttributeValueController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-33",
    "module": "attributes",
    "method": "GET",
    "path": "/api/v1/attributes",
    "summary": "GET endpoint for attributes index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attributes (index)",
    "controller": "AttributeController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-34",
    "module": "attributes",
    "method": "POST",
    "path": "/api/v1/attributes",
    "summary": "POST endpoint for attributes store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attributes (store)",
    "controller": "AttributeController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-35",
    "module": "attributes",
    "method": "POST",
    "path": "/api/v1/attributes/bulk-delete",
    "summary": "POST endpoint for attributes bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attributes (bulkDelete)",
    "controller": "AttributeController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-36",
    "module": "attributes",
    "method": "POST",
    "path": "/api/v1/attributes/bulk-restore",
    "summary": "POST endpoint for attributes bulkRestore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attributes (bulkRestore)",
    "controller": "AttributeController",
    "action": "bulkRestore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-37",
    "module": "attributes",
    "method": "GET",
    "path": "/api/v1/attributes/export",
    "summary": "GET endpoint for attributes export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attributes (export)",
    "controller": "AttributeController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-38",
    "module": "attributes",
    "method": "POST",
    "path": "/api/v1/attributes/import",
    "summary": "POST endpoint for attributes import",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attributes (import)",
    "controller": "AttributeController",
    "action": "import",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-39",
    "module": "attributes",
    "method": "GET",
    "path": "/api/v1/attributes/{attribute}",
    "summary": "GET endpoint for attributes show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attributes (show)",
    "controller": "AttributeController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-40",
    "module": "attributes",
    "method": "PUT",
    "path": "/api/v1/attributes/{attribute}",
    "summary": "PUT endpoint for attributes update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attributes (update)",
    "controller": "AttributeController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-41",
    "module": "attributes",
    "method": "DELETE",
    "path": "/api/v1/attributes/{attribute}",
    "summary": "DELETE endpoint for attributes destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attributes (destroy)",
    "controller": "AttributeController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-42",
    "module": "attributes",
    "method": "DELETE",
    "path": "/api/v1/attributes/{id}/force",
    "summary": "DELETE endpoint for attributes forceDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attributes (forceDelete)",
    "controller": "AttributeController",
    "action": "forceDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-43",
    "module": "attributes",
    "method": "POST",
    "path": "/api/v1/attributes/{id}/restore",
    "summary": "POST endpoint for attributes restore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ attributes (restore)",
    "controller": "AttributeController",
    "action": "restore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-44",
    "module": "audit-logs",
    "method": "GET",
    "path": "/api/v1/audit-logs",
    "summary": "GET endpoint for audit-logs index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ audit-logs (index)",
    "controller": "AuditLogController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-45",
    "module": "audit-logs",
    "method": "POST",
    "path": "/api/v1/audit-logs",
    "summary": "POST endpoint for audit-logs store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ audit-logs (store)",
    "controller": "AuditLogController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-46",
    "module": "audit-logs",
    "method": "GET",
    "path": "/api/v1/audit-logs/{audit_log}",
    "summary": "GET endpoint for audit-logs show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ audit-logs (show)",
    "controller": "AuditLogController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-47",
    "module": "audit-logs",
    "method": "PUT",
    "path": "/api/v1/audit-logs/{audit_log}",
    "summary": "PUT endpoint for audit-logs update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ audit-logs (update)",
    "controller": "AuditLogController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-48",
    "module": "audit-logs",
    "method": "DELETE",
    "path": "/api/v1/audit-logs/{audit_log}",
    "summary": "DELETE endpoint for audit-logs destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ audit-logs (destroy)",
    "controller": "AuditLogController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-49",
    "module": "auth",
    "method": "POST",
    "path": "/api/v1/auth/change-password",
    "summary": "POST endpoint for auth changePassword",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ auth (changePassword)",
    "controller": "AuthController",
    "action": "changePassword",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-50",
    "module": "auth",
    "method": "POST",
    "path": "/api/v1/auth/forgot-password",
    "summary": "POST endpoint for auth forgotPassword",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ auth (forgotPassword)",
    "controller": "AuthController",
    "action": "forgotPassword",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-51",
    "module": "auth",
    "method": "POST",
    "path": "/api/v1/auth/login",
    "summary": "POST endpoint for auth login",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ auth (login)",
    "controller": "AuthController",
    "action": "login",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-52",
    "module": "auth",
    "method": "POST",
    "path": "/api/v1/auth/logout",
    "summary": "POST endpoint for auth logout",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ auth (logout)",
    "controller": "AuthController",
    "action": "logout",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-53",
    "module": "auth",
    "method": "POST",
    "path": "/api/v1/auth/logout-all-devices",
    "summary": "POST endpoint for auth logoutAllDevices",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ auth (logoutAllDevices)",
    "controller": "AuthController",
    "action": "logoutAllDevices",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-54",
    "module": "auth",
    "method": "GET",
    "path": "/api/v1/auth/profile",
    "summary": "GET endpoint for auth profile",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ auth (profile)",
    "controller": "AuthController",
    "action": "profile",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-55",
    "module": "auth",
    "method": "PUT",
    "path": "/api/v1/auth/profile",
    "summary": "PUT endpoint for auth updateProfile",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ auth (updateProfile)",
    "controller": "AuthController",
    "action": "updateProfile",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-56",
    "module": "auth",
    "method": "POST",
    "path": "/api/v1/auth/refresh",
    "summary": "POST endpoint for auth refresh",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ auth (refresh)",
    "controller": "AuthController",
    "action": "refresh",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-57",
    "module": "auth",
    "method": "POST",
    "path": "/api/v1/auth/register",
    "summary": "POST endpoint for auth register",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ auth (register)",
    "controller": "AuthController",
    "action": "register",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-58",
    "module": "auth",
    "method": "POST",
    "path": "/api/v1/auth/reset-password",
    "summary": "POST endpoint for auth resetPassword",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ auth (resetPassword)",
    "controller": "AuthController",
    "action": "resetPassword",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-59",
    "module": "banners",
    "method": "GET",
    "path": "/api/v1/banners",
    "summary": "GET endpoint for banners index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ banners (index)",
    "controller": "BannerController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-60",
    "module": "banners",
    "method": "POST",
    "path": "/api/v1/banners",
    "summary": "POST endpoint for banners store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ banners (store)",
    "controller": "BannerController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-61",
    "module": "banners",
    "method": "GET",
    "path": "/api/v1/banners/{banner}",
    "summary": "GET endpoint for banners show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ banners (show)",
    "controller": "BannerController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-62",
    "module": "banners",
    "method": "PUT",
    "path": "/api/v1/banners/{banner}",
    "summary": "PUT endpoint for banners update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ banners (update)",
    "controller": "BannerController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-63",
    "module": "banners",
    "method": "DELETE",
    "path": "/api/v1/banners/{banner}",
    "summary": "DELETE endpoint for banners destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ banners (destroy)",
    "controller": "BannerController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-64",
    "module": "blog-categories",
    "method": "GET",
    "path": "/api/v1/blog-categories",
    "summary": "GET endpoint for blog-categories index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ blog-categories (index)",
    "controller": "BlogCategoryController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-65",
    "module": "blog-categories",
    "method": "POST",
    "path": "/api/v1/blog-categories",
    "summary": "POST endpoint for blog-categories store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ blog-categories (store)",
    "controller": "BlogCategoryController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-66",
    "module": "blog-categories",
    "method": "GET",
    "path": "/api/v1/blog-categories/{blog_category}",
    "summary": "GET endpoint for blog-categories show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ blog-categories (show)",
    "controller": "BlogCategoryController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-67",
    "module": "blog-categories",
    "method": "PUT",
    "path": "/api/v1/blog-categories/{blog_category}",
    "summary": "PUT endpoint for blog-categories update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ blog-categories (update)",
    "controller": "BlogCategoryController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-68",
    "module": "blog-categories",
    "method": "DELETE",
    "path": "/api/v1/blog-categories/{blog_category}",
    "summary": "DELETE endpoint for blog-categories destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ blog-categories (destroy)",
    "controller": "BlogCategoryController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-69",
    "module": "blog-tags",
    "method": "GET",
    "path": "/api/v1/blog-tags",
    "summary": "GET endpoint for blog-tags index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ blog-tags (index)",
    "controller": "BlogTagController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-70",
    "module": "blog-tags",
    "method": "POST",
    "path": "/api/v1/blog-tags",
    "summary": "POST endpoint for blog-tags store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ blog-tags (store)",
    "controller": "BlogTagController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-71",
    "module": "blog-tags",
    "method": "GET",
    "path": "/api/v1/blog-tags/{blog_tag}",
    "summary": "GET endpoint for blog-tags show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ blog-tags (show)",
    "controller": "BlogTagController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-72",
    "module": "blog-tags",
    "method": "PUT",
    "path": "/api/v1/blog-tags/{blog_tag}",
    "summary": "PUT endpoint for blog-tags update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ blog-tags (update)",
    "controller": "BlogTagController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-73",
    "module": "blog-tags",
    "method": "DELETE",
    "path": "/api/v1/blog-tags/{blog_tag}",
    "summary": "DELETE endpoint for blog-tags destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ blog-tags (destroy)",
    "controller": "BlogTagController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-74",
    "module": "blogs",
    "method": "GET",
    "path": "/api/v1/blogs",
    "summary": "GET endpoint for blogs index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ blogs (index)",
    "controller": "BlogController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-75",
    "module": "blogs",
    "method": "POST",
    "path": "/api/v1/blogs",
    "summary": "POST endpoint for blogs store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ blogs (store)",
    "controller": "BlogController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-76",
    "module": "blogs",
    "method": "GET",
    "path": "/api/v1/blogs/{blog}",
    "summary": "GET endpoint for blogs show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ blogs (show)",
    "controller": "BlogController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-77",
    "module": "blogs",
    "method": "PUT",
    "path": "/api/v1/blogs/{blog}",
    "summary": "PUT endpoint for blogs update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ blogs (update)",
    "controller": "BlogController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-78",
    "module": "blogs",
    "method": "DELETE",
    "path": "/api/v1/blogs/{blog}",
    "summary": "DELETE endpoint for blogs destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ blogs (destroy)",
    "controller": "BlogController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-79",
    "module": "blogs",
    "method": "DELETE",
    "path": "/api/v1/blogs/{id}/force",
    "summary": "DELETE endpoint for blogs forceDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ blogs (forceDelete)",
    "controller": "BlogController",
    "action": "forceDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-80",
    "module": "blogs",
    "method": "POST",
    "path": "/api/v1/blogs/{id}/restore",
    "summary": "POST endpoint for blogs restore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ blogs (restore)",
    "controller": "BlogController",
    "action": "restore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-81",
    "module": "branches",
    "method": "GET",
    "path": "/api/v1/branches",
    "summary": "GET endpoint for branches index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ branches (index)",
    "controller": "BranchController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-82",
    "module": "branches",
    "method": "POST",
    "path": "/api/v1/branches",
    "summary": "POST endpoint for branches store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ branches (store)",
    "controller": "BranchController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-83",
    "module": "branches",
    "method": "GET",
    "path": "/api/v1/branches/{branch}",
    "summary": "GET endpoint for branches show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ branches (show)",
    "controller": "BranchController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-84",
    "module": "branches",
    "method": "PUT",
    "path": "/api/v1/branches/{branch}",
    "summary": "PUT endpoint for branches update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ branches (update)",
    "controller": "BranchController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-85",
    "module": "branches",
    "method": "DELETE",
    "path": "/api/v1/branches/{branch}",
    "summary": "DELETE endpoint for branches destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ branches (destroy)",
    "controller": "BranchController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-86",
    "module": "branches",
    "method": "DELETE",
    "path": "/api/v1/branches/{id}/force",
    "summary": "DELETE endpoint for branches forceDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ branches (forceDelete)",
    "controller": "BranchController",
    "action": "forceDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-87",
    "module": "branches",
    "method": "POST",
    "path": "/api/v1/branches/{id}/restore",
    "summary": "POST endpoint for branches restore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ branches (restore)",
    "controller": "BranchController",
    "action": "restore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-88",
    "module": "brands",
    "method": "GET",
    "path": "/api/v1/brands",
    "summary": "GET endpoint for brands index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ brands (index)",
    "controller": "BrandController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-89",
    "module": "brands",
    "method": "POST",
    "path": "/api/v1/brands",
    "summary": "POST endpoint for brands store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ brands (store)",
    "controller": "BrandController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-90",
    "module": "brands",
    "method": "POST",
    "path": "/api/v1/brands/bulk-delete",
    "summary": "POST endpoint for brands bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ brands (bulkDelete)",
    "controller": "BrandController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-91",
    "module": "brands",
    "method": "POST",
    "path": "/api/v1/brands/bulk-restore",
    "summary": "POST endpoint for brands bulkRestore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ brands (bulkRestore)",
    "controller": "BrandController",
    "action": "bulkRestore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-92",
    "module": "brands",
    "method": "GET",
    "path": "/api/v1/brands/export",
    "summary": "GET endpoint for brands export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ brands (export)",
    "controller": "BrandController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-93",
    "module": "brands",
    "method": "POST",
    "path": "/api/v1/brands/import",
    "summary": "POST endpoint for brands import",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ brands (import)",
    "controller": "BrandController",
    "action": "import",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-94",
    "module": "brands",
    "method": "GET",
    "path": "/api/v1/brands/{brand}",
    "summary": "GET endpoint for brands show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ brands (show)",
    "controller": "BrandController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-95",
    "module": "brands",
    "method": "PUT",
    "path": "/api/v1/brands/{brand}",
    "summary": "PUT endpoint for brands update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ brands (update)",
    "controller": "BrandController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-96",
    "module": "brands",
    "method": "DELETE",
    "path": "/api/v1/brands/{brand}",
    "summary": "DELETE endpoint for brands destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ brands (destroy)",
    "controller": "BrandController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-97",
    "module": "brands",
    "method": "DELETE",
    "path": "/api/v1/brands/{id}/force",
    "summary": "DELETE endpoint for brands forceDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ brands (forceDelete)",
    "controller": "BrandController",
    "action": "forceDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-98",
    "module": "brands",
    "method": "POST",
    "path": "/api/v1/brands/{id}/restore",
    "summary": "POST endpoint for brands restore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ brands (restore)",
    "controller": "BrandController",
    "action": "restore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-99",
    "module": "cart-items",
    "method": "GET",
    "path": "/api/v1/cart-items",
    "summary": "GET endpoint for cart-items index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ cart-items (index)",
    "controller": "CartItemController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-100",
    "module": "cart-items",
    "method": "POST",
    "path": "/api/v1/cart-items",
    "summary": "POST endpoint for cart-items store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ cart-items (store)",
    "controller": "CartItemController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-101",
    "module": "cart-items",
    "method": "GET",
    "path": "/api/v1/cart-items/{cart_item}",
    "summary": "GET endpoint for cart-items show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ cart-items (show)",
    "controller": "CartItemController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-102",
    "module": "cart-items",
    "method": "PUT",
    "path": "/api/v1/cart-items/{cart_item}",
    "summary": "PUT endpoint for cart-items update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ cart-items (update)",
    "controller": "CartItemController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-103",
    "module": "cart-items",
    "method": "DELETE",
    "path": "/api/v1/cart-items/{cart_item}",
    "summary": "DELETE endpoint for cart-items destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ cart-items (destroy)",
    "controller": "CartItemController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-104",
    "module": "carts",
    "method": "GET",
    "path": "/api/v1/carts",
    "summary": "GET endpoint for carts index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ carts (index)",
    "controller": "CartController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-105",
    "module": "carts",
    "method": "POST",
    "path": "/api/v1/carts",
    "summary": "POST endpoint for carts store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ carts (store)",
    "controller": "CartController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-106",
    "module": "carts",
    "method": "GET",
    "path": "/api/v1/carts/{cart}",
    "summary": "GET endpoint for carts show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ carts (show)",
    "controller": "CartController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-107",
    "module": "carts",
    "method": "PUT",
    "path": "/api/v1/carts/{cart}",
    "summary": "PUT endpoint for carts update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ carts (update)",
    "controller": "CartController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-108",
    "module": "carts",
    "method": "DELETE",
    "path": "/api/v1/carts/{cart}",
    "summary": "DELETE endpoint for carts destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ carts (destroy)",
    "controller": "CartController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-109",
    "module": "cash-register-transactions",
    "method": "GET",
    "path": "/api/v1/cash-register-transactions",
    "summary": "GET endpoint for cash-register-transactions index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ cash-register-transactions (index)",
    "controller": "CashRegisterTransactionController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-110",
    "module": "cash-register-transactions",
    "method": "POST",
    "path": "/api/v1/cash-register-transactions",
    "summary": "POST endpoint for cash-register-transactions store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ cash-register-transactions (store)",
    "controller": "CashRegisterTransactionController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-111",
    "module": "cash-register-transactions",
    "method": "GET",
    "path": "/api/v1/cash-register-transactions/{cash_register_transaction}",
    "summary": "GET endpoint for cash-register-transactions show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ cash-register-transactions (show)",
    "controller": "CashRegisterTransactionController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-112",
    "module": "cash-register-transactions",
    "method": "PUT",
    "path": "/api/v1/cash-register-transactions/{cash_register_transaction}",
    "summary": "PUT endpoint for cash-register-transactions update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ cash-register-transactions (update)",
    "controller": "CashRegisterTransactionController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-113",
    "module": "cash-register-transactions",
    "method": "DELETE",
    "path": "/api/v1/cash-register-transactions/{cash_register_transaction}",
    "summary": "DELETE endpoint for cash-register-transactions destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ cash-register-transactions (destroy)",
    "controller": "CashRegisterTransactionController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-114",
    "module": "categories",
    "method": "GET",
    "path": "/api/v1/categories",
    "summary": "GET endpoint for categories index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ categories (index)",
    "controller": "CategoryController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-115",
    "module": "categories",
    "method": "POST",
    "path": "/api/v1/categories",
    "summary": "POST endpoint for categories store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ categories (store)",
    "controller": "CategoryController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-116",
    "module": "categories",
    "method": "POST",
    "path": "/api/v1/categories/bulk-delete",
    "summary": "POST endpoint for categories bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ categories (bulkDelete)",
    "controller": "CategoryController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-117",
    "module": "categories",
    "method": "POST",
    "path": "/api/v1/categories/bulk-restore",
    "summary": "POST endpoint for categories bulkRestore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ categories (bulkRestore)",
    "controller": "CategoryController",
    "action": "bulkRestore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-118",
    "module": "categories",
    "method": "GET",
    "path": "/api/v1/categories/export",
    "summary": "GET endpoint for categories export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ categories (export)",
    "controller": "CategoryController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-119",
    "module": "categories",
    "method": "POST",
    "path": "/api/v1/categories/import",
    "summary": "POST endpoint for categories import",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ categories (import)",
    "controller": "CategoryController",
    "action": "import",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-120",
    "module": "categories",
    "method": "GET",
    "path": "/api/v1/categories/{category}",
    "summary": "GET endpoint for categories show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ categories (show)",
    "controller": "CategoryController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-121",
    "module": "categories",
    "method": "PUT",
    "path": "/api/v1/categories/{category}",
    "summary": "PUT endpoint for categories update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ categories (update)",
    "controller": "CategoryController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-122",
    "module": "categories",
    "method": "DELETE",
    "path": "/api/v1/categories/{category}",
    "summary": "DELETE endpoint for categories destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ categories (destroy)",
    "controller": "CategoryController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-123",
    "module": "categories",
    "method": "DELETE",
    "path": "/api/v1/categories/{id}/force",
    "summary": "DELETE endpoint for categories forceDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ categories (forceDelete)",
    "controller": "CategoryController",
    "action": "forceDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-124",
    "module": "categories",
    "method": "POST",
    "path": "/api/v1/categories/{id}/restore",
    "summary": "POST endpoint for categories restore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ categories (restore)",
    "controller": "CategoryController",
    "action": "restore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-125",
    "module": "cities",
    "method": "GET",
    "path": "/api/v1/cities",
    "summary": "GET endpoint for cities index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ cities (index)",
    "controller": "CityController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-126",
    "module": "cities",
    "method": "POST",
    "path": "/api/v1/cities",
    "summary": "POST endpoint for cities store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ cities (store)",
    "controller": "CityController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-127",
    "module": "cities",
    "method": "POST",
    "path": "/api/v1/cities/bulk-delete",
    "summary": "POST endpoint for cities bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ cities (bulkDelete)",
    "controller": "CityController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-128",
    "module": "cities",
    "method": "GET",
    "path": "/api/v1/cities/{city}",
    "summary": "GET endpoint for cities show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ cities (show)",
    "controller": "CityController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-129",
    "module": "cities",
    "method": "PUT",
    "path": "/api/v1/cities/{city}",
    "summary": "PUT endpoint for cities update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ cities (update)",
    "controller": "CityController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-130",
    "module": "cities",
    "method": "DELETE",
    "path": "/api/v1/cities/{city}",
    "summary": "DELETE endpoint for cities destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ cities (destroy)",
    "controller": "CityController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-131",
    "module": "companies",
    "method": "GET",
    "path": "/api/v1/companies",
    "summary": "GET endpoint for companies index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ companies (index)",
    "controller": "CompanyController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-132",
    "module": "companies",
    "method": "POST",
    "path": "/api/v1/companies",
    "summary": "POST endpoint for companies store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ companies (store)",
    "controller": "CompanyController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-133",
    "module": "companies",
    "method": "GET",
    "path": "/api/v1/companies/{company}",
    "summary": "GET endpoint for companies show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ companies (show)",
    "controller": "CompanyController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-134",
    "module": "companies",
    "method": "PUT",
    "path": "/api/v1/companies/{company}",
    "summary": "PUT endpoint for companies update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ companies (update)",
    "controller": "CompanyController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-135",
    "module": "companies",
    "method": "DELETE",
    "path": "/api/v1/companies/{company}",
    "summary": "DELETE endpoint for companies destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ companies (destroy)",
    "controller": "CompanyController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-136",
    "module": "countries",
    "method": "GET",
    "path": "/api/v1/countries",
    "summary": "GET endpoint for countries index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ countries (index)",
    "controller": "CountryController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-137",
    "module": "countries",
    "method": "POST",
    "path": "/api/v1/countries",
    "summary": "POST endpoint for countries store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ countries (store)",
    "controller": "CountryController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-138",
    "module": "countries",
    "method": "POST",
    "path": "/api/v1/countries/bulk-delete",
    "summary": "POST endpoint for countries bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ countries (bulkDelete)",
    "controller": "CountryController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-139",
    "module": "countries",
    "method": "GET",
    "path": "/api/v1/countries/{country}",
    "summary": "GET endpoint for countries show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ countries (show)",
    "controller": "CountryController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-140",
    "module": "countries",
    "method": "PUT",
    "path": "/api/v1/countries/{country}",
    "summary": "PUT endpoint for countries update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ countries (update)",
    "controller": "CountryController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-141",
    "module": "countries",
    "method": "DELETE",
    "path": "/api/v1/countries/{country}",
    "summary": "DELETE endpoint for countries destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ countries (destroy)",
    "controller": "CountryController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-142",
    "module": "coupons",
    "method": "GET",
    "path": "/api/v1/coupons",
    "summary": "GET endpoint for coupons index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ coupons (index)",
    "controller": "CouponController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-143",
    "module": "coupons",
    "method": "POST",
    "path": "/api/v1/coupons",
    "summary": "POST endpoint for coupons store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ coupons (store)",
    "controller": "CouponController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-144",
    "module": "coupons",
    "method": "GET",
    "path": "/api/v1/coupons/generate-code",
    "summary": "GET endpoint for coupons generateCode",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ coupons (generateCode)",
    "controller": "CouponController",
    "action": "generateCode",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-145",
    "module": "coupons",
    "method": "POST",
    "path": "/api/v1/coupons/validate",
    "summary": "POST endpoint for coupons validateCoupon",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ coupons (validateCoupon)",
    "controller": "CouponController",
    "action": "validateCoupon",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-146",
    "module": "coupons",
    "method": "GET",
    "path": "/api/v1/coupons/{coupon}",
    "summary": "GET endpoint for coupons show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ coupons (show)",
    "controller": "CouponController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-147",
    "module": "coupons",
    "method": "PUT",
    "path": "/api/v1/coupons/{coupon}",
    "summary": "PUT endpoint for coupons update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ coupons (update)",
    "controller": "CouponController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-148",
    "module": "coupons",
    "method": "DELETE",
    "path": "/api/v1/coupons/{coupon}",
    "summary": "DELETE endpoint for coupons destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ coupons (destroy)",
    "controller": "CouponController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-149",
    "module": "currencies",
    "method": "GET",
    "path": "/api/v1/currencies",
    "summary": "GET endpoint for currencies index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ currencies (index)",
    "controller": "CurrencyController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-150",
    "module": "currencies",
    "method": "POST",
    "path": "/api/v1/currencies",
    "summary": "POST endpoint for currencies store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ currencies (store)",
    "controller": "CurrencyController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-151",
    "module": "currencies",
    "method": "GET",
    "path": "/api/v1/currencies/{currency}",
    "summary": "GET endpoint for currencies show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ currencies (show)",
    "controller": "CurrencyController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-152",
    "module": "currencies",
    "method": "PUT",
    "path": "/api/v1/currencies/{currency}",
    "summary": "PUT endpoint for currencies update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ currencies (update)",
    "controller": "CurrencyController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-153",
    "module": "currencies",
    "method": "DELETE",
    "path": "/api/v1/currencies/{currency}",
    "summary": "DELETE endpoint for currencies destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ currencies (destroy)",
    "controller": "CurrencyController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-154",
    "module": "customer-addresses",
    "method": "GET",
    "path": "/api/v1/customer-addresses",
    "summary": "GET endpoint for customer-addresses index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customer-addresses (index)",
    "controller": "CustomerAddressController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-155",
    "module": "customer-addresses",
    "method": "POST",
    "path": "/api/v1/customer-addresses",
    "summary": "POST endpoint for customer-addresses store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customer-addresses (store)",
    "controller": "CustomerAddressController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-156",
    "module": "customer-addresses",
    "method": "POST",
    "path": "/api/v1/customer-addresses/bulk-delete",
    "summary": "POST endpoint for customer-addresses bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customer-addresses (bulkDelete)",
    "controller": "CustomerAddressController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-157",
    "module": "customer-addresses",
    "method": "GET",
    "path": "/api/v1/customer-addresses/export",
    "summary": "GET endpoint for customer-addresses export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customer-addresses (export)",
    "controller": "CustomerAddressController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-158",
    "module": "customer-addresses",
    "method": "POST",
    "path": "/api/v1/customer-addresses/import",
    "summary": "POST endpoint for customer-addresses import",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customer-addresses (import)",
    "controller": "CustomerAddressController",
    "action": "import",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-159",
    "module": "customer-addresses",
    "method": "GET",
    "path": "/api/v1/customer-addresses/{customer_address}",
    "summary": "GET endpoint for customer-addresses show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customer-addresses (show)",
    "controller": "CustomerAddressController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-160",
    "module": "customer-addresses",
    "method": "PUT",
    "path": "/api/v1/customer-addresses/{customer_address}",
    "summary": "PUT endpoint for customer-addresses update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customer-addresses (update)",
    "controller": "CustomerAddressController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-161",
    "module": "customer-addresses",
    "method": "DELETE",
    "path": "/api/v1/customer-addresses/{customer_address}",
    "summary": "DELETE endpoint for customer-addresses destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customer-addresses (destroy)",
    "controller": "CustomerAddressController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-162",
    "module": "customer-groups",
    "method": "GET",
    "path": "/api/v1/customer-groups",
    "summary": "GET endpoint for customer-groups index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customer-groups (index)",
    "controller": "CustomerGroupController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-163",
    "module": "customer-groups",
    "method": "POST",
    "path": "/api/v1/customer-groups",
    "summary": "POST endpoint for customer-groups store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customer-groups (store)",
    "controller": "CustomerGroupController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-164",
    "module": "customer-groups",
    "method": "POST",
    "path": "/api/v1/customer-groups/bulk-delete",
    "summary": "POST endpoint for customer-groups bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customer-groups (bulkDelete)",
    "controller": "CustomerGroupController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-165",
    "module": "customer-groups",
    "method": "POST",
    "path": "/api/v1/customer-groups/bulk-restore",
    "summary": "POST endpoint for customer-groups bulkRestore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customer-groups (bulkRestore)",
    "controller": "CustomerGroupController",
    "action": "bulkRestore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-166",
    "module": "customer-groups",
    "method": "GET",
    "path": "/api/v1/customer-groups/export",
    "summary": "GET endpoint for customer-groups export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customer-groups (export)",
    "controller": "CustomerGroupController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-167",
    "module": "customer-groups",
    "method": "POST",
    "path": "/api/v1/customer-groups/import",
    "summary": "POST endpoint for customer-groups import",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customer-groups (import)",
    "controller": "CustomerGroupController",
    "action": "import",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-168",
    "module": "customer-groups",
    "method": "GET",
    "path": "/api/v1/customer-groups/{customer_group}",
    "summary": "GET endpoint for customer-groups show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customer-groups (show)",
    "controller": "CustomerGroupController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-169",
    "module": "customer-groups",
    "method": "PUT",
    "path": "/api/v1/customer-groups/{customer_group}",
    "summary": "PUT endpoint for customer-groups update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customer-groups (update)",
    "controller": "CustomerGroupController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-170",
    "module": "customer-groups",
    "method": "DELETE",
    "path": "/api/v1/customer-groups/{customer_group}",
    "summary": "DELETE endpoint for customer-groups destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customer-groups (destroy)",
    "controller": "CustomerGroupController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-171",
    "module": "customer-groups",
    "method": "DELETE",
    "path": "/api/v1/customer-groups/{id}/force",
    "summary": "DELETE endpoint for customer-groups forceDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customer-groups (forceDelete)",
    "controller": "CustomerGroupController",
    "action": "forceDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-172",
    "module": "customer-groups",
    "method": "POST",
    "path": "/api/v1/customer-groups/{id}/restore",
    "summary": "POST endpoint for customer-groups restore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customer-groups (restore)",
    "controller": "CustomerGroupController",
    "action": "restore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-173",
    "module": "customers",
    "method": "GET",
    "path": "/api/v1/customers",
    "summary": "GET endpoint for customers index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customers (index)",
    "controller": "CustomerController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-174",
    "module": "customers",
    "method": "POST",
    "path": "/api/v1/customers",
    "summary": "POST endpoint for customers store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customers (store)",
    "controller": "CustomerController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-175",
    "module": "customers",
    "method": "POST",
    "path": "/api/v1/customers/bulk-activate",
    "summary": "POST endpoint for customers bulkActivate",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customers (bulkActivate)",
    "controller": "CustomerController",
    "action": "bulkActivate",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-176",
    "module": "customers",
    "method": "POST",
    "path": "/api/v1/customers/bulk-assign-group",
    "summary": "POST endpoint for customers bulkAssignGroup",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customers (bulkAssignGroup)",
    "controller": "CustomerController",
    "action": "bulkAssignGroup",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-177",
    "module": "customers",
    "method": "POST",
    "path": "/api/v1/customers/bulk-deactivate",
    "summary": "POST endpoint for customers bulkDeactivate",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customers (bulkDeactivate)",
    "controller": "CustomerController",
    "action": "bulkDeactivate",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-178",
    "module": "customers",
    "method": "POST",
    "path": "/api/v1/customers/bulk-delete",
    "summary": "POST endpoint for customers bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customers (bulkDelete)",
    "controller": "CustomerController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-179",
    "module": "customers",
    "method": "POST",
    "path": "/api/v1/customers/bulk-restore",
    "summary": "POST endpoint for customers bulkRestore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customers (bulkRestore)",
    "controller": "CustomerController",
    "action": "bulkRestore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-180",
    "module": "customers",
    "method": "GET",
    "path": "/api/v1/customers/export",
    "summary": "GET endpoint for customers export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customers (export)",
    "controller": "CustomerController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-181",
    "module": "customers",
    "method": "POST",
    "path": "/api/v1/customers/import",
    "summary": "POST endpoint for customers import",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customers (import)",
    "controller": "CustomerController",
    "action": "import",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-182",
    "module": "customers",
    "method": "GET",
    "path": "/api/v1/customers/stats",
    "summary": "GET endpoint for customers stats",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customers (stats)",
    "controller": "CustomerController",
    "action": "stats",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-183",
    "module": "customers",
    "method": "GET",
    "path": "/api/v1/customers/{customer}",
    "summary": "GET endpoint for customers show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customers (show)",
    "controller": "CustomerController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-184",
    "module": "customers",
    "method": "PUT",
    "path": "/api/v1/customers/{customer}",
    "summary": "PUT endpoint for customers update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customers (update)",
    "controller": "CustomerController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-185",
    "module": "customers",
    "method": "DELETE",
    "path": "/api/v1/customers/{customer}",
    "summary": "DELETE endpoint for customers destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customers (destroy)",
    "controller": "CustomerController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-186",
    "module": "customers",
    "method": "DELETE",
    "path": "/api/v1/customers/{id}/force",
    "summary": "DELETE endpoint for customers forceDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customers (forceDelete)",
    "controller": "CustomerController",
    "action": "forceDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-187",
    "module": "customers",
    "method": "GET",
    "path": "/api/v1/customers/{id}/orders",
    "summary": "GET endpoint for customers orders",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customers (orders)",
    "controller": "CustomerController",
    "action": "orders",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-188",
    "module": "customers",
    "method": "POST",
    "path": "/api/v1/customers/{id}/restore",
    "summary": "POST endpoint for customers restore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ customers (restore)",
    "controller": "CustomerController",
    "action": "restore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-189",
    "module": "dashboard",
    "method": "GET",
    "path": "/api/v1/dashboard/alerts",
    "summary": "GET endpoint for dashboard alerts",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ dashboard (alerts)",
    "controller": "DashboardController",
    "action": "alerts",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-190",
    "module": "dashboard",
    "method": "GET",
    "path": "/api/v1/dashboard/charts",
    "summary": "GET endpoint for dashboard charts",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ dashboard (charts)",
    "controller": "DashboardController",
    "action": "charts",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-191",
    "module": "dashboard",
    "method": "GET",
    "path": "/api/v1/dashboard/low-stock",
    "summary": "GET endpoint for dashboard lowStock",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ dashboard (lowStock)",
    "controller": "DashboardController",
    "action": "lowStock",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-192",
    "module": "dashboard",
    "method": "GET",
    "path": "/api/v1/dashboard/operation-panels",
    "summary": "GET endpoint for dashboard operationPanels",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ dashboard (operationPanels)",
    "controller": "DashboardController",
    "action": "operationPanels",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-193",
    "module": "dashboard",
    "method": "GET",
    "path": "/api/v1/dashboard/recent-orders",
    "summary": "GET endpoint for dashboard recentOrders",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ dashboard (recentOrders)",
    "controller": "DashboardController",
    "action": "recentOrders",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-194",
    "module": "dashboard",
    "method": "GET",
    "path": "/api/v1/dashboard/sales-chart",
    "summary": "GET endpoint for dashboard salesChart",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ dashboard (salesChart)",
    "controller": "DashboardController",
    "action": "salesChart",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-195",
    "module": "dashboard",
    "method": "GET",
    "path": "/api/v1/dashboard/stats",
    "summary": "GET endpoint for dashboard stats",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ dashboard (stats)",
    "controller": "DashboardController",
    "action": "stats",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-196",
    "module": "dashboard",
    "method": "GET",
    "path": "/api/v1/dashboard/system-health",
    "summary": "GET endpoint for dashboard systemHealth",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ dashboard (systemHealth)",
    "controller": "DashboardController",
    "action": "systemHealth",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-197",
    "module": "dashboard",
    "method": "GET",
    "path": "/api/v1/dashboard/top-products",
    "summary": "GET endpoint for dashboard topProducts",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ dashboard (topProducts)",
    "controller": "DashboardController",
    "action": "topProducts",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-198",
    "module": "departments",
    "method": "GET",
    "path": "/api/v1/departments",
    "summary": "GET endpoint for departments index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ departments (index)",
    "controller": "DepartmentController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-199",
    "module": "departments",
    "method": "POST",
    "path": "/api/v1/departments",
    "summary": "POST endpoint for departments store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ departments (store)",
    "controller": "DepartmentController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-200",
    "module": "departments",
    "method": "POST",
    "path": "/api/v1/departments/bulk-delete",
    "summary": "POST endpoint for departments bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ departments (bulkDelete)",
    "controller": "DepartmentController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-201",
    "module": "departments",
    "method": "POST",
    "path": "/api/v1/departments/bulk-restore",
    "summary": "POST endpoint for departments bulkRestore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ departments (bulkRestore)",
    "controller": "DepartmentController",
    "action": "bulkRestore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-202",
    "module": "departments",
    "method": "GET",
    "path": "/api/v1/departments/export",
    "summary": "GET endpoint for departments export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ departments (export)",
    "controller": "DepartmentController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-203",
    "module": "departments",
    "method": "POST",
    "path": "/api/v1/departments/import",
    "summary": "POST endpoint for departments import",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ departments (import)",
    "controller": "DepartmentController",
    "action": "import",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-204",
    "module": "departments",
    "method": "GET",
    "path": "/api/v1/departments/{department}",
    "summary": "GET endpoint for departments show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ departments (show)",
    "controller": "DepartmentController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-205",
    "module": "departments",
    "method": "PUT",
    "path": "/api/v1/departments/{department}",
    "summary": "PUT endpoint for departments update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ departments (update)",
    "controller": "DepartmentController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-206",
    "module": "departments",
    "method": "DELETE",
    "path": "/api/v1/departments/{department}",
    "summary": "DELETE endpoint for departments destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ departments (destroy)",
    "controller": "DepartmentController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-207",
    "module": "departments",
    "method": "DELETE",
    "path": "/api/v1/departments/{id}/force",
    "summary": "DELETE endpoint for departments forceDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ departments (forceDelete)",
    "controller": "DepartmentController",
    "action": "forceDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-208",
    "module": "departments",
    "method": "POST",
    "path": "/api/v1/departments/{id}/restore",
    "summary": "POST endpoint for departments restore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ departments (restore)",
    "controller": "DepartmentController",
    "action": "restore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-209",
    "module": "devices",
    "method": "GET",
    "path": "/api/v1/devices",
    "summary": "GET endpoint for devices index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ devices (index)",
    "controller": "DeviceController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-210",
    "module": "devices",
    "method": "POST",
    "path": "/api/v1/devices/revoke-others",
    "summary": "POST endpoint for devices revokeOthers",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ devices (revokeOthers)",
    "controller": "DeviceController",
    "action": "revokeOthers",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-211",
    "module": "devices",
    "method": "POST",
    "path": "/api/v1/devices/{id}/revoke",
    "summary": "POST endpoint for devices revoke",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ devices (revoke)",
    "controller": "DeviceController",
    "action": "revoke",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-212",
    "module": "devices",
    "method": "POST",
    "path": "/api/v1/devices/{id}/suspicious",
    "summary": "POST endpoint for devices markSuspicious",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ devices (markSuspicious)",
    "controller": "DeviceController",
    "action": "markSuspicious",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-213",
    "module": "employees",
    "method": "GET",
    "path": "/api/v1/employees",
    "summary": "GET endpoint for employees index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ employees (index)",
    "controller": "EmployeeController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-214",
    "module": "employees",
    "method": "POST",
    "path": "/api/v1/employees",
    "summary": "POST endpoint for employees store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ employees (store)",
    "controller": "EmployeeController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-215",
    "module": "employees",
    "method": "POST",
    "path": "/api/v1/employees/bulk-delete",
    "summary": "POST endpoint for employees bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ employees (bulkDelete)",
    "controller": "EmployeeController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-216",
    "module": "employees",
    "method": "POST",
    "path": "/api/v1/employees/bulk-restore",
    "summary": "POST endpoint for employees bulkRestore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ employees (bulkRestore)",
    "controller": "EmployeeController",
    "action": "bulkRestore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-217",
    "module": "employees",
    "method": "GET",
    "path": "/api/v1/employees/export",
    "summary": "GET endpoint for employees export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ employees (export)",
    "controller": "EmployeeController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-218",
    "module": "employees",
    "method": "POST",
    "path": "/api/v1/employees/import",
    "summary": "POST endpoint for employees import",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ employees (import)",
    "controller": "EmployeeController",
    "action": "import",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-219",
    "module": "employees",
    "method": "GET",
    "path": "/api/v1/employees/stats",
    "summary": "GET endpoint for employees stats",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ employees (stats)",
    "controller": "EmployeeController",
    "action": "stats",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-220",
    "module": "employees",
    "method": "POST",
    "path": "/api/v1/employees/upload-photo",
    "summary": "POST endpoint for employees uploadPhoto",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ employees (uploadPhoto)",
    "controller": "EmployeeController",
    "action": "uploadPhoto",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-221",
    "module": "employees",
    "method": "GET",
    "path": "/api/v1/employees/{employee}",
    "summary": "GET endpoint for employees show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ employees (show)",
    "controller": "EmployeeController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-222",
    "module": "employees",
    "method": "PUT",
    "path": "/api/v1/employees/{employee}",
    "summary": "PUT endpoint for employees update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ employees (update)",
    "controller": "EmployeeController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-223",
    "module": "employees",
    "method": "DELETE",
    "path": "/api/v1/employees/{employee}",
    "summary": "DELETE endpoint for employees destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ employees (destroy)",
    "controller": "EmployeeController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-224",
    "module": "employees",
    "method": "DELETE",
    "path": "/api/v1/employees/{id}/force",
    "summary": "DELETE endpoint for employees forceDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ employees (forceDelete)",
    "controller": "EmployeeController",
    "action": "forceDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-225",
    "module": "employees",
    "method": "POST",
    "path": "/api/v1/employees/{id}/restore",
    "summary": "POST endpoint for employees restore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ employees (restore)",
    "controller": "EmployeeController",
    "action": "restore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-226",
    "module": "expense-categories",
    "method": "GET",
    "path": "/api/v1/expense-categories",
    "summary": "GET endpoint for expense-categories index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ expense-categories (index)",
    "controller": "ExpenseCategoryController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-227",
    "module": "expense-categories",
    "method": "POST",
    "path": "/api/v1/expense-categories",
    "summary": "POST endpoint for expense-categories store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ expense-categories (store)",
    "controller": "ExpenseCategoryController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-228",
    "module": "expense-categories",
    "method": "POST",
    "path": "/api/v1/expense-categories/bulk-delete",
    "summary": "POST endpoint for expense-categories bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ expense-categories (bulkDelete)",
    "controller": "ExpenseCategoryController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-229",
    "module": "expense-categories",
    "method": "GET",
    "path": "/api/v1/expense-categories/{expense_category}",
    "summary": "GET endpoint for expense-categories show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ expense-categories (show)",
    "controller": "ExpenseCategoryController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-230",
    "module": "expense-categories",
    "method": "PUT",
    "path": "/api/v1/expense-categories/{expense_category}",
    "summary": "PUT endpoint for expense-categories update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ expense-categories (update)",
    "controller": "ExpenseCategoryController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-231",
    "module": "expense-categories",
    "method": "DELETE",
    "path": "/api/v1/expense-categories/{expense_category}",
    "summary": "DELETE endpoint for expense-categories destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ expense-categories (destroy)",
    "controller": "ExpenseCategoryController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-232",
    "module": "expenses",
    "method": "GET",
    "path": "/api/v1/expenses",
    "summary": "GET endpoint for expenses index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ expenses (index)",
    "controller": "ExpenseController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-233",
    "module": "expenses",
    "method": "POST",
    "path": "/api/v1/expenses",
    "summary": "POST endpoint for expenses store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ expenses (store)",
    "controller": "ExpenseController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-234",
    "module": "expenses",
    "method": "POST",
    "path": "/api/v1/expenses/bulk-delete",
    "summary": "POST endpoint for expenses bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ expenses (bulkDelete)",
    "controller": "ExpenseController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-235",
    "module": "expenses",
    "method": "POST",
    "path": "/api/v1/expenses/bulk-restore",
    "summary": "POST endpoint for expenses bulkRestore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ expenses (bulkRestore)",
    "controller": "ExpenseController",
    "action": "bulkRestore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-236",
    "module": "expenses",
    "method": "GET",
    "path": "/api/v1/expenses/stats",
    "summary": "GET endpoint for expenses stats",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ expenses (stats)",
    "controller": "ExpenseController",
    "action": "stats",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-237",
    "module": "expenses",
    "method": "GET",
    "path": "/api/v1/expenses/{expense}",
    "summary": "GET endpoint for expenses show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ expenses (show)",
    "controller": "ExpenseController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-238",
    "module": "expenses",
    "method": "PUT",
    "path": "/api/v1/expenses/{expense}",
    "summary": "PUT endpoint for expenses update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ expenses (update)",
    "controller": "ExpenseController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-239",
    "module": "expenses",
    "method": "DELETE",
    "path": "/api/v1/expenses/{expense}",
    "summary": "DELETE endpoint for expenses destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ expenses (destroy)",
    "controller": "ExpenseController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-240",
    "module": "expenses",
    "method": "DELETE",
    "path": "/api/v1/expenses/{id}/force",
    "summary": "DELETE endpoint for expenses forceDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ expenses (forceDelete)",
    "controller": "ExpenseController",
    "action": "forceDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-241",
    "module": "expenses",
    "method": "POST",
    "path": "/api/v1/expenses/{id}/restore",
    "summary": "POST endpoint for expenses restore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ expenses (restore)",
    "controller": "ExpenseController",
    "action": "restore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-242",
    "module": "faqs",
    "method": "GET",
    "path": "/api/v1/faqs",
    "summary": "GET endpoint for faqs index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ faqs (index)",
    "controller": "FaqController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-243",
    "module": "faqs",
    "method": "POST",
    "path": "/api/v1/faqs",
    "summary": "POST endpoint for faqs store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ faqs (store)",
    "controller": "FaqController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-244",
    "module": "faqs",
    "method": "GET",
    "path": "/api/v1/faqs/{faq}",
    "summary": "GET endpoint for faqs show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ faqs (show)",
    "controller": "FaqController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-245",
    "module": "faqs",
    "method": "PUT",
    "path": "/api/v1/faqs/{faq}",
    "summary": "PUT endpoint for faqs update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ faqs (update)",
    "controller": "FaqController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-246",
    "module": "faqs",
    "method": "DELETE",
    "path": "/api/v1/faqs/{faq}",
    "summary": "DELETE endpoint for faqs destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ faqs (destroy)",
    "controller": "FaqController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-247",
    "module": "finance",
    "method": "GET",
    "path": "/api/v1/finance/analytics",
    "summary": "GET endpoint for finance analytics",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ finance (analytics)",
    "controller": "FinanceAnalyticsController",
    "action": "analytics",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-248",
    "module": "flash-sales",
    "method": "GET",
    "path": "/api/v1/flash-sales",
    "summary": "GET endpoint for flash-sales index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ flash-sales (index)",
    "controller": "FlashSaleController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-249",
    "module": "flash-sales",
    "method": "POST",
    "path": "/api/v1/flash-sales",
    "summary": "POST endpoint for flash-sales store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ flash-sales (store)",
    "controller": "FlashSaleController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-250",
    "module": "flash-sales",
    "method": "GET",
    "path": "/api/v1/flash-sales/{flash_sale}",
    "summary": "GET endpoint for flash-sales show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ flash-sales (show)",
    "controller": "FlashSaleController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-251",
    "module": "flash-sales",
    "method": "PUT",
    "path": "/api/v1/flash-sales/{flash_sale}",
    "summary": "PUT endpoint for flash-sales update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ flash-sales (update)",
    "controller": "FlashSaleController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-252",
    "module": "flash-sales",
    "method": "DELETE",
    "path": "/api/v1/flash-sales/{flash_sale}",
    "summary": "DELETE endpoint for flash-sales destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ flash-sales (destroy)",
    "controller": "FlashSaleController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-253",
    "module": "health",
    "method": "GET",
    "path": "/api/v1/health",
    "summary": "GET endpoint for health check",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ health (check)",
    "controller": "HealthController",
    "action": "check",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-254",
    "module": "inventories",
    "method": "GET",
    "path": "/api/v1/inventories",
    "summary": "GET endpoint for inventories index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ inventories (index)",
    "controller": "InventoryController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-255",
    "module": "inventories",
    "method": "POST",
    "path": "/api/v1/inventories",
    "summary": "POST endpoint for inventories store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ inventories (store)",
    "controller": "InventoryController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-256",
    "module": "inventories",
    "method": "GET",
    "path": "/api/v1/inventories/{inventory}",
    "summary": "GET endpoint for inventories show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ inventories (show)",
    "controller": "InventoryController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-257",
    "module": "inventories",
    "method": "PUT",
    "path": "/api/v1/inventories/{inventory}",
    "summary": "PUT endpoint for inventories update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ inventories (update)",
    "controller": "InventoryController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-258",
    "module": "inventories",
    "method": "DELETE",
    "path": "/api/v1/inventories/{inventory}",
    "summary": "DELETE endpoint for inventories destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ inventories (destroy)",
    "controller": "InventoryController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-259",
    "module": "inventory",
    "method": "GET",
    "path": "/api/v1/inventory",
    "summary": "GET endpoint for inventory index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ inventory (index)",
    "controller": "InventoryController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-260",
    "module": "inventory-movements",
    "method": "GET",
    "path": "/api/v1/inventory-movements",
    "summary": "GET endpoint for inventory-movements index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ inventory-movements (index)",
    "controller": "InventoryMovementController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-261",
    "module": "inventory-movements",
    "method": "POST",
    "path": "/api/v1/inventory-movements",
    "summary": "POST endpoint for inventory-movements store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ inventory-movements (store)",
    "controller": "InventoryMovementController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-262",
    "module": "inventory-movements",
    "method": "GET",
    "path": "/api/v1/inventory-movements/{inventory_movement}",
    "summary": "GET endpoint for inventory-movements show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ inventory-movements (show)",
    "controller": "InventoryMovementController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-263",
    "module": "inventory-movements",
    "method": "PUT",
    "path": "/api/v1/inventory-movements/{inventory_movement}",
    "summary": "PUT endpoint for inventory-movements update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ inventory-movements (update)",
    "controller": "InventoryMovementController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-264",
    "module": "inventory-movements",
    "method": "DELETE",
    "path": "/api/v1/inventory-movements/{inventory_movement}",
    "summary": "DELETE endpoint for inventory-movements destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ inventory-movements (destroy)",
    "controller": "InventoryMovementController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-265",
    "module": "inventory",
    "method": "GET",
    "path": "/api/v1/inventory/dashboard",
    "summary": "GET endpoint for inventory stats",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ inventory (stats)",
    "controller": "InventoryController",
    "action": "stats",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-266",
    "module": "inventory",
    "method": "GET",
    "path": "/api/v1/inventory/export",
    "summary": "GET endpoint for inventory export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ inventory (export)",
    "controller": "InventoryController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-267",
    "module": "inventory",
    "method": "POST",
    "path": "/api/v1/inventory/import",
    "summary": "POST endpoint for inventory import",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ inventory (import)",
    "controller": "InventoryController",
    "action": "import",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-268",
    "module": "inventory",
    "method": "GET",
    "path": "/api/v1/inventory/low-stock",
    "summary": "GET endpoint for inventory lowStock",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ inventory (lowStock)",
    "controller": "InventoryController",
    "action": "lowStock",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-269",
    "module": "inventory",
    "method": "GET",
    "path": "/api/v1/inventory/product/{pid}",
    "summary": "GET endpoint for inventory byProduct",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ inventory (byProduct)",
    "controller": "InventoryController",
    "action": "byProduct",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-270",
    "module": "inventory",
    "method": "GET",
    "path": "/api/v1/inventory/stats",
    "summary": "GET endpoint for inventory stats",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ inventory (stats)",
    "controller": "InventoryController",
    "action": "stats",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-271",
    "module": "inventory",
    "method": "GET",
    "path": "/api/v1/inventory/{id}",
    "summary": "GET endpoint for inventory show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ inventory (show)",
    "controller": "InventoryController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-272",
    "module": "languages",
    "method": "GET",
    "path": "/api/v1/languages",
    "summary": "GET endpoint for languages index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ languages (index)",
    "controller": "LanguageController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-273",
    "module": "languages",
    "method": "POST",
    "path": "/api/v1/languages",
    "summary": "POST endpoint for languages store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ languages (store)",
    "controller": "LanguageController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-274",
    "module": "languages",
    "method": "GET",
    "path": "/api/v1/languages/{language}",
    "summary": "GET endpoint for languages show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ languages (show)",
    "controller": "LanguageController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-275",
    "module": "languages",
    "method": "PUT",
    "path": "/api/v1/languages/{language}",
    "summary": "PUT endpoint for languages update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ languages (update)",
    "controller": "LanguageController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-276",
    "module": "languages",
    "method": "DELETE",
    "path": "/api/v1/languages/{language}",
    "summary": "DELETE endpoint for languages destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ languages (destroy)",
    "controller": "LanguageController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-277",
    "module": "login-histories",
    "method": "GET",
    "path": "/api/v1/login-histories",
    "summary": "GET endpoint for login-histories index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ login-histories (index)",
    "controller": "LoginHistoryController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-278",
    "module": "login-histories",
    "method": "POST",
    "path": "/api/v1/login-histories",
    "summary": "POST endpoint for login-histories store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ login-histories (store)",
    "controller": "LoginHistoryController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-279",
    "module": "login-histories",
    "method": "GET",
    "path": "/api/v1/login-histories/{login_history}",
    "summary": "GET endpoint for login-histories show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ login-histories (show)",
    "controller": "LoginHistoryController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-280",
    "module": "login-histories",
    "method": "PUT",
    "path": "/api/v1/login-histories/{login_history}",
    "summary": "PUT endpoint for login-histories update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ login-histories (update)",
    "controller": "LoginHistoryController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-281",
    "module": "login-histories",
    "method": "DELETE",
    "path": "/api/v1/login-histories/{login_history}",
    "summary": "DELETE endpoint for login-histories destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ login-histories (destroy)",
    "controller": "LoginHistoryController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-282",
    "module": "notification-logs",
    "method": "GET",
    "path": "/api/v1/notification-logs",
    "summary": "GET endpoint for notification-logs index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notification-logs (index)",
    "controller": "NotificationLogController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-283",
    "module": "notification-logs",
    "method": "POST",
    "path": "/api/v1/notification-logs",
    "summary": "POST endpoint for notification-logs store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notification-logs (store)",
    "controller": "NotificationLogController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-284",
    "module": "notification-logs",
    "method": "GET",
    "path": "/api/v1/notification-logs/{notification_log}",
    "summary": "GET endpoint for notification-logs show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notification-logs (show)",
    "controller": "NotificationLogController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-285",
    "module": "notification-logs",
    "method": "PUT",
    "path": "/api/v1/notification-logs/{notification_log}",
    "summary": "PUT endpoint for notification-logs update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notification-logs (update)",
    "controller": "NotificationLogController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-286",
    "module": "notification-logs",
    "method": "DELETE",
    "path": "/api/v1/notification-logs/{notification_log}",
    "summary": "DELETE endpoint for notification-logs destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notification-logs (destroy)",
    "controller": "NotificationLogController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-287",
    "module": "notification-settings",
    "method": "GET",
    "path": "/api/v1/notification-settings",
    "summary": "GET endpoint for notification-settings show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notification-settings (show)",
    "controller": "NotificationSettingController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-288",
    "module": "notification-settings",
    "method": "PUT",
    "path": "/api/v1/notification-settings",
    "summary": "PUT endpoint for notification-settings update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notification-settings (update)",
    "controller": "NotificationSettingController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-289",
    "module": "notification-settings",
    "method": "POST",
    "path": "/api/v1/notification-settings/test-channel",
    "summary": "POST endpoint for notification-settings testChannel",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notification-settings (testChannel)",
    "controller": "NotificationSettingController",
    "action": "testChannel",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-290",
    "module": "notification-settings",
    "method": "POST",
    "path": "/api/v1/notification-settings/test-email",
    "summary": "POST endpoint for notification-settings testEmail",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notification-settings (testEmail)",
    "controller": "NotificationSettingController",
    "action": "testEmail",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-291",
    "module": "notification-settings",
    "method": "POST",
    "path": "/api/v1/notification-settings/test-push",
    "summary": "POST endpoint for notification-settings testPush",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notification-settings (testPush)",
    "controller": "NotificationSettingController",
    "action": "testPush",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-292",
    "module": "notification-settings",
    "method": "POST",
    "path": "/api/v1/notification-settings/test-sms",
    "summary": "POST endpoint for notification-settings testSms",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notification-settings (testSms)",
    "controller": "NotificationSettingController",
    "action": "testSms",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-293",
    "module": "notification-settings",
    "method": "POST",
    "path": "/api/v1/notification-settings/test-telegram",
    "summary": "POST endpoint for notification-settings testTelegram",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notification-settings (testTelegram)",
    "controller": "NotificationSettingController",
    "action": "testTelegram",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-294",
    "module": "notification-templates",
    "method": "GET",
    "path": "/api/v1/notification-templates",
    "summary": "GET endpoint for notification-templates index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notification-templates (index)",
    "controller": "NotificationTemplateController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-295",
    "module": "notification-templates",
    "method": "POST",
    "path": "/api/v1/notification-templates",
    "summary": "POST endpoint for notification-templates store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notification-templates (store)",
    "controller": "NotificationTemplateController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-296",
    "module": "notification-templates",
    "method": "GET",
    "path": "/api/v1/notification-templates/export",
    "summary": "GET endpoint for notification-templates export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notification-templates (export)",
    "controller": "NotificationTemplateController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-297",
    "module": "notification-templates",
    "method": "POST",
    "path": "/api/v1/notification-templates/import",
    "summary": "POST endpoint for notification-templates import",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notification-templates (import)",
    "controller": "NotificationTemplateController",
    "action": "import",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-298",
    "module": "notification-templates",
    "method": "POST",
    "path": "/api/v1/notification-templates/{id}/duplicate",
    "summary": "POST endpoint for notification-templates duplicate",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notification-templates (duplicate)",
    "controller": "NotificationTemplateController",
    "action": "duplicate",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-299",
    "module": "notification-templates",
    "method": "PUT",
    "path": "/api/v1/notification-templates/{id}/toggle-status",
    "summary": "PUT endpoint for notification-templates toggleStatus",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notification-templates (toggleStatus)",
    "controller": "NotificationTemplateController",
    "action": "toggleStatus",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-300",
    "module": "notification-templates",
    "method": "GET",
    "path": "/api/v1/notification-templates/{notification_template}",
    "summary": "GET endpoint for notification-templates show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notification-templates (show)",
    "controller": "NotificationTemplateController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-301",
    "module": "notification-templates",
    "method": "PUT",
    "path": "/api/v1/notification-templates/{notification_template}",
    "summary": "PUT endpoint for notification-templates update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notification-templates (update)",
    "controller": "NotificationTemplateController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-302",
    "module": "notification-templates",
    "method": "DELETE",
    "path": "/api/v1/notification-templates/{notification_template}",
    "summary": "DELETE endpoint for notification-templates destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notification-templates (destroy)",
    "controller": "NotificationTemplateController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-303",
    "module": "notifications",
    "method": "GET",
    "path": "/api/v1/notifications",
    "summary": "GET endpoint for notifications index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notifications (index)",
    "controller": "NotificationController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-304",
    "module": "notifications",
    "method": "POST",
    "path": "/api/v1/notifications",
    "summary": "POST endpoint for notifications store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notifications (store)",
    "controller": "NotificationController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-305",
    "module": "notifications",
    "method": "POST",
    "path": "/api/v1/notifications/bulk",
    "summary": "POST endpoint for notifications bulk",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notifications (bulk)",
    "controller": "NotificationController",
    "action": "bulk",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-306",
    "module": "notifications",
    "method": "DELETE",
    "path": "/api/v1/notifications/clear",
    "summary": "DELETE endpoint for notifications clear",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notifications (clear)",
    "controller": "NotificationController",
    "action": "clear",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-307",
    "module": "notifications",
    "method": "GET",
    "path": "/api/v1/notifications/export",
    "summary": "GET endpoint for notifications export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notifications (export)",
    "controller": "NotificationController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-308",
    "module": "notifications",
    "method": "PUT",
    "path": "/api/v1/notifications/read-all",
    "summary": "PUT endpoint for notifications markAllAsRead",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notifications (markAllAsRead)",
    "controller": "NotificationController",
    "action": "markAllAsRead",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-309",
    "module": "notifications",
    "method": "GET",
    "path": "/api/v1/notifications/stats",
    "summary": "GET endpoint for notifications stats",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notifications (stats)",
    "controller": "NotificationController",
    "action": "stats",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-310",
    "module": "notifications",
    "method": "GET",
    "path": "/api/v1/notifications/unread",
    "summary": "GET endpoint for notifications unread",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notifications (unread)",
    "controller": "NotificationController",
    "action": "unread",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-311",
    "module": "notifications",
    "method": "POST",
    "path": "/api/v1/notifications/{id}/duplicate",
    "summary": "POST endpoint for notifications duplicate",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notifications (duplicate)",
    "controller": "NotificationController",
    "action": "duplicate",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-312",
    "module": "notifications",
    "method": "GET",
    "path": "/api/v1/notifications/{id}/logs",
    "summary": "GET endpoint for notifications logs",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notifications (logs)",
    "controller": "NotificationController",
    "action": "logs",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-313",
    "module": "notifications",
    "method": "PUT",
    "path": "/api/v1/notifications/{id}/read",
    "summary": "PUT endpoint for notifications markAsRead",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notifications (markAsRead)",
    "controller": "NotificationController",
    "action": "markAsRead",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-314",
    "module": "notifications",
    "method": "GET",
    "path": "/api/v1/notifications/{notification}",
    "summary": "GET endpoint for notifications show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notifications (show)",
    "controller": "NotificationController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-315",
    "module": "notifications",
    "method": "PUT",
    "path": "/api/v1/notifications/{notification}",
    "summary": "PUT endpoint for notifications update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notifications (update)",
    "controller": "NotificationController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-316",
    "module": "notifications",
    "method": "DELETE",
    "path": "/api/v1/notifications/{notification}",
    "summary": "DELETE endpoint for notifications destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ notifications (destroy)",
    "controller": "NotificationController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-317",
    "module": "order-items",
    "method": "GET",
    "path": "/api/v1/order-items",
    "summary": "GET endpoint for order-items index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ order-items (index)",
    "controller": "OrderItemController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-318",
    "module": "order-items",
    "method": "POST",
    "path": "/api/v1/order-items",
    "summary": "POST endpoint for order-items store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ order-items (store)",
    "controller": "OrderItemController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-319",
    "module": "order-items",
    "method": "GET",
    "path": "/api/v1/order-items/{order_item}",
    "summary": "GET endpoint for order-items show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ order-items (show)",
    "controller": "OrderItemController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-320",
    "module": "order-items",
    "method": "PUT",
    "path": "/api/v1/order-items/{order_item}",
    "summary": "PUT endpoint for order-items update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ order-items (update)",
    "controller": "OrderItemController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-321",
    "module": "order-items",
    "method": "DELETE",
    "path": "/api/v1/order-items/{order_item}",
    "summary": "DELETE endpoint for order-items destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ order-items (destroy)",
    "controller": "OrderItemController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-322",
    "module": "order-status-histories",
    "method": "GET",
    "path": "/api/v1/order-status-histories",
    "summary": "GET endpoint for order-status-histories index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ order-status-histories (index)",
    "controller": "OrderStatusHistoryController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-323",
    "module": "order-status-histories",
    "method": "POST",
    "path": "/api/v1/order-status-histories",
    "summary": "POST endpoint for order-status-histories store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ order-status-histories (store)",
    "controller": "OrderStatusHistoryController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-324",
    "module": "order-status-histories",
    "method": "GET",
    "path": "/api/v1/order-status-histories/{order_status_history}",
    "summary": "GET endpoint for order-status-histories show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ order-status-histories (show)",
    "controller": "OrderStatusHistoryController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-325",
    "module": "order-status-histories",
    "method": "PUT",
    "path": "/api/v1/order-status-histories/{order_status_history}",
    "summary": "PUT endpoint for order-status-histories update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ order-status-histories (update)",
    "controller": "OrderStatusHistoryController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-326",
    "module": "order-status-histories",
    "method": "DELETE",
    "path": "/api/v1/order-status-histories/{order_status_history}",
    "summary": "DELETE endpoint for order-status-histories destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ order-status-histories (destroy)",
    "controller": "OrderStatusHistoryController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-327",
    "module": "orders",
    "method": "GET",
    "path": "/api/v1/orders",
    "summary": "GET endpoint for orders index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ orders (index)",
    "controller": "OrderController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-328",
    "module": "orders",
    "method": "POST",
    "path": "/api/v1/orders",
    "summary": "POST endpoint for orders store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ orders (store)",
    "controller": "OrderController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-329",
    "module": "orders",
    "method": "POST",
    "path": "/api/v1/orders/{id}/cancel",
    "summary": "POST endpoint for orders cancel",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ orders (cancel)",
    "controller": "OrderController",
    "action": "cancel",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-330",
    "module": "orders",
    "method": "POST",
    "path": "/api/v1/orders/{id}/complete",
    "summary": "POST endpoint for orders complete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ orders (complete)",
    "controller": "OrderController",
    "action": "complete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-331",
    "module": "orders",
    "method": "POST",
    "path": "/api/v1/orders/{id}/confirm",
    "summary": "POST endpoint for orders confirm",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ orders (confirm)",
    "controller": "OrderController",
    "action": "confirm",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-332",
    "module": "orders",
    "method": "POST",
    "path": "/api/v1/orders/{id}/deliver",
    "summary": "POST endpoint for orders deliver",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ orders (deliver)",
    "controller": "OrderController",
    "action": "deliver",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-333",
    "module": "orders",
    "method": "GET",
    "path": "/api/v1/orders/{id}/invoice",
    "summary": "GET endpoint for orders invoice",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ orders (invoice)",
    "controller": "OrderController",
    "action": "invoice",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-334",
    "module": "orders",
    "method": "POST",
    "path": "/api/v1/orders/{id}/refund",
    "summary": "POST endpoint for orders refund",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ orders (refund)",
    "controller": "OrderController",
    "action": "refund",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-335",
    "module": "orders",
    "method": "POST",
    "path": "/api/v1/orders/{id}/ship",
    "summary": "POST endpoint for orders ship",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ orders (ship)",
    "controller": "OrderController",
    "action": "ship",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-336",
    "module": "orders",
    "method": "GET",
    "path": "/api/v1/orders/{id}/tracking",
    "summary": "GET endpoint for orders tracking",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ orders (tracking)",
    "controller": "OrderController",
    "action": "tracking",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-337",
    "module": "orders",
    "method": "GET",
    "path": "/api/v1/orders/{order}",
    "summary": "GET endpoint for orders show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ orders (show)",
    "controller": "OrderController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-338",
    "module": "orders",
    "method": "PUT",
    "path": "/api/v1/orders/{order}",
    "summary": "PUT endpoint for orders update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ orders (update)",
    "controller": "OrderController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-339",
    "module": "orders",
    "method": "DELETE",
    "path": "/api/v1/orders/{order}",
    "summary": "DELETE endpoint for orders destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ orders (destroy)",
    "controller": "OrderController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-340",
    "module": "pages",
    "method": "GET",
    "path": "/api/v1/pages",
    "summary": "GET endpoint for pages index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ pages (index)",
    "controller": "PageController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-341",
    "module": "pages",
    "method": "POST",
    "path": "/api/v1/pages",
    "summary": "POST endpoint for pages store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ pages (store)",
    "controller": "PageController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-342",
    "module": "pages",
    "method": "GET",
    "path": "/api/v1/pages/{page}",
    "summary": "GET endpoint for pages show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ pages (show)",
    "controller": "PageController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-343",
    "module": "pages",
    "method": "PUT",
    "path": "/api/v1/pages/{page}",
    "summary": "PUT endpoint for pages update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ pages (update)",
    "controller": "PageController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-344",
    "module": "pages",
    "method": "DELETE",
    "path": "/api/v1/pages/{page}",
    "summary": "DELETE endpoint for pages destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ pages (destroy)",
    "controller": "PageController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-345",
    "module": "payment-methods",
    "method": "GET",
    "path": "/api/v1/payment-methods",
    "summary": "GET endpoint for payment-methods index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ payment-methods (index)",
    "controller": "PaymentMethodController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-346",
    "module": "payment-methods",
    "method": "POST",
    "path": "/api/v1/payment-methods",
    "summary": "POST endpoint for payment-methods store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ payment-methods (store)",
    "controller": "PaymentMethodController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-347",
    "module": "payment-methods",
    "method": "GET",
    "path": "/api/v1/payment-methods/{payment_method}",
    "summary": "GET endpoint for payment-methods show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ payment-methods (show)",
    "controller": "PaymentMethodController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-348",
    "module": "payment-methods",
    "method": "PUT",
    "path": "/api/v1/payment-methods/{payment_method}",
    "summary": "PUT endpoint for payment-methods update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ payment-methods (update)",
    "controller": "PaymentMethodController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-349",
    "module": "payment-methods",
    "method": "DELETE",
    "path": "/api/v1/payment-methods/{payment_method}",
    "summary": "DELETE endpoint for payment-methods destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ payment-methods (destroy)",
    "controller": "PaymentMethodController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-350",
    "module": "payments",
    "method": "GET",
    "path": "/api/v1/payments",
    "summary": "GET endpoint for payments index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ payments (index)",
    "controller": "PaymentController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-351",
    "module": "payments",
    "method": "POST",
    "path": "/api/v1/payments/process",
    "summary": "POST endpoint for payments process",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ payments (process)",
    "controller": "PaymentController",
    "action": "process",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-352",
    "module": "payments",
    "method": "GET",
    "path": "/api/v1/payments/{id}",
    "summary": "GET endpoint for payments show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ payments (show)",
    "controller": "PaymentController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-353",
    "module": "payrolls",
    "method": "GET",
    "path": "/api/v1/payrolls",
    "summary": "GET endpoint for payrolls index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ payrolls (index)",
    "controller": "PayrollController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-354",
    "module": "payrolls",
    "method": "POST",
    "path": "/api/v1/payrolls",
    "summary": "POST endpoint for payrolls store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ payrolls (store)",
    "controller": "PayrollController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-355",
    "module": "payrolls",
    "method": "POST",
    "path": "/api/v1/payrolls/bulk-delete",
    "summary": "POST endpoint for payrolls bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ payrolls (bulkDelete)",
    "controller": "PayrollController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-356",
    "module": "payrolls",
    "method": "GET",
    "path": "/api/v1/payrolls/export",
    "summary": "GET endpoint for payrolls export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ payrolls (export)",
    "controller": "PayrollController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-357",
    "module": "payrolls",
    "method": "POST",
    "path": "/api/v1/payrolls/import",
    "summary": "POST endpoint for payrolls import",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ payrolls (import)",
    "controller": "PayrollController",
    "action": "import",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-358",
    "module": "payrolls",
    "method": "GET",
    "path": "/api/v1/payrolls/{payroll}",
    "summary": "GET endpoint for payrolls show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ payrolls (show)",
    "controller": "PayrollController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-359",
    "module": "payrolls",
    "method": "PUT",
    "path": "/api/v1/payrolls/{payroll}",
    "summary": "PUT endpoint for payrolls update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ payrolls (update)",
    "controller": "PayrollController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-360",
    "module": "payrolls",
    "method": "DELETE",
    "path": "/api/v1/payrolls/{payroll}",
    "summary": "DELETE endpoint for payrolls destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ payrolls (destroy)",
    "controller": "PayrollController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-361",
    "module": "permissions",
    "method": "GET",
    "path": "/api/v1/permissions",
    "summary": "GET endpoint for permissions index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ permissions (index)",
    "controller": "PermissionController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-362",
    "module": "permissions",
    "method": "POST",
    "path": "/api/v1/permissions",
    "summary": "POST endpoint for permissions store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ permissions (store)",
    "controller": "PermissionController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-363",
    "module": "permissions",
    "method": "GET",
    "path": "/api/v1/permissions/dashboard",
    "summary": "GET endpoint for permissions stats",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ permissions (stats)",
    "controller": "PermissionController",
    "action": "stats",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-364",
    "module": "permissions",
    "method": "GET",
    "path": "/api/v1/permissions/stats",
    "summary": "GET endpoint for permissions stats",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ permissions (stats)",
    "controller": "PermissionController",
    "action": "stats",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-365",
    "module": "permissions",
    "method": "GET",
    "path": "/api/v1/permissions/{permission}",
    "summary": "GET endpoint for permissions show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ permissions (show)",
    "controller": "PermissionController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-366",
    "module": "permissions",
    "method": "PUT",
    "path": "/api/v1/permissions/{permission}",
    "summary": "PUT endpoint for permissions update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ permissions (update)",
    "controller": "PermissionController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-367",
    "module": "permissions",
    "method": "DELETE",
    "path": "/api/v1/permissions/{permission}",
    "summary": "DELETE endpoint for permissions destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ permissions (destroy)",
    "controller": "PermissionController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-368",
    "module": "pos",
    "method": "POST",
    "path": "/api/v1/pos/apply-coupon",
    "summary": "POST endpoint for pos applyCoupon",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ pos (applyCoupon)",
    "controller": "POSController",
    "action": "applyCoupon",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-369",
    "module": "pos",
    "method": "GET",
    "path": "/api/v1/pos/cash-registers",
    "summary": "GET endpoint for pos index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ pos (index)",
    "controller": "CashRegisterController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-370",
    "module": "pos",
    "method": "POST",
    "path": "/api/v1/pos/cash-registers",
    "summary": "POST endpoint for pos store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ pos (store)",
    "controller": "CashRegisterController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-371",
    "module": "pos",
    "method": "GET",
    "path": "/api/v1/pos/cash-registers/{cash_register}",
    "summary": "GET endpoint for pos show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ pos (show)",
    "controller": "CashRegisterController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-372",
    "module": "pos",
    "method": "PUT",
    "path": "/api/v1/pos/cash-registers/{cash_register}",
    "summary": "PUT endpoint for pos update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ pos (update)",
    "controller": "CashRegisterController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-373",
    "module": "pos",
    "method": "DELETE",
    "path": "/api/v1/pos/cash-registers/{cash_register}",
    "summary": "DELETE endpoint for pos destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ pos (destroy)",
    "controller": "CashRegisterController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-374",
    "module": "pos",
    "method": "POST",
    "path": "/api/v1/pos/cash-registers/{id}/close",
    "summary": "POST endpoint for pos close",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ pos (close)",
    "controller": "CashRegisterController",
    "action": "close",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-375",
    "module": "pos",
    "method": "POST",
    "path": "/api/v1/pos/cash-registers/{id}/open",
    "summary": "POST endpoint for pos open",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ pos (open)",
    "controller": "CashRegisterController",
    "action": "open",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-376",
    "module": "pos",
    "method": "GET",
    "path": "/api/v1/pos/product-search",
    "summary": "GET endpoint for pos productSearch",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ pos (productSearch)",
    "controller": "POSController",
    "action": "productSearch",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-377",
    "module": "pos",
    "method": "GET",
    "path": "/api/v1/pos/products/barcode/{code}",
    "summary": "GET endpoint for pos barcodeLookup",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ pos (barcodeLookup)",
    "controller": "POSController",
    "action": "barcodeLookup",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-378",
    "module": "pos",
    "method": "POST",
    "path": "/api/v1/pos/sales",
    "summary": "POST endpoint for pos sale",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ pos (sale)",
    "controller": "POSController",
    "action": "sale",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-379",
    "module": "pos",
    "method": "GET",
    "path": "/api/v1/pos/sales",
    "summary": "GET endpoint for pos index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ pos (index)",
    "controller": "POSController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-380",
    "module": "pos",
    "method": "GET",
    "path": "/api/v1/pos/sales/{id}",
    "summary": "GET endpoint for pos show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ pos (show)",
    "controller": "POSController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-381",
    "module": "pos",
    "method": "POST",
    "path": "/api/v1/pos/sales/{id}/return",
    "summary": "POST endpoint for pos processReturn",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ pos (processReturn)",
    "controller": "POSController",
    "action": "processReturn",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-382",
    "module": "pos",
    "method": "POST",
    "path": "/api/v1/pos/vision-search",
    "summary": "POST endpoint for pos visionSearch",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ pos (visionSearch)",
    "controller": "POSController",
    "action": "visionSearch",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-383",
    "module": "pos",
    "method": "POST",
    "path": "/api/v1/pos/voice-search",
    "summary": "POST endpoint for pos voiceSearch",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ pos (voiceSearch)",
    "controller": "POSController",
    "action": "voiceSearch",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-384",
    "module": "positions",
    "method": "GET",
    "path": "/api/v1/positions",
    "summary": "GET endpoint for positions index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ positions (index)",
    "controller": "PositionController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-385",
    "module": "positions",
    "method": "POST",
    "path": "/api/v1/positions",
    "summary": "POST endpoint for positions store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ positions (store)",
    "controller": "PositionController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-386",
    "module": "positions",
    "method": "POST",
    "path": "/api/v1/positions/bulk-delete",
    "summary": "POST endpoint for positions bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ positions (bulkDelete)",
    "controller": "PositionController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-387",
    "module": "positions",
    "method": "POST",
    "path": "/api/v1/positions/bulk-restore",
    "summary": "POST endpoint for positions bulkRestore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ positions (bulkRestore)",
    "controller": "PositionController",
    "action": "bulkRestore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-388",
    "module": "positions",
    "method": "GET",
    "path": "/api/v1/positions/export",
    "summary": "GET endpoint for positions export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ positions (export)",
    "controller": "PositionController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-389",
    "module": "positions",
    "method": "POST",
    "path": "/api/v1/positions/import",
    "summary": "POST endpoint for positions import",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ positions (import)",
    "controller": "PositionController",
    "action": "import",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-390",
    "module": "positions",
    "method": "DELETE",
    "path": "/api/v1/positions/{id}/force",
    "summary": "DELETE endpoint for positions forceDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ positions (forceDelete)",
    "controller": "PositionController",
    "action": "forceDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-391",
    "module": "positions",
    "method": "POST",
    "path": "/api/v1/positions/{id}/restore",
    "summary": "POST endpoint for positions restore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ positions (restore)",
    "controller": "PositionController",
    "action": "restore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-392",
    "module": "positions",
    "method": "GET",
    "path": "/api/v1/positions/{position}",
    "summary": "GET endpoint for positions show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ positions (show)",
    "controller": "PositionController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-393",
    "module": "positions",
    "method": "PUT",
    "path": "/api/v1/positions/{position}",
    "summary": "PUT endpoint for positions update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ positions (update)",
    "controller": "PositionController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-394",
    "module": "positions",
    "method": "DELETE",
    "path": "/api/v1/positions/{position}",
    "summary": "DELETE endpoint for positions destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ positions (destroy)",
    "controller": "PositionController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-395",
    "module": "product-images",
    "method": "GET",
    "path": "/api/v1/product-images",
    "summary": "GET endpoint for product-images index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-images (index)",
    "controller": "ProductImageController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-396",
    "module": "product-images",
    "method": "POST",
    "path": "/api/v1/product-images",
    "summary": "POST endpoint for product-images store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-images (store)",
    "controller": "ProductImageController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-397",
    "module": "product-images",
    "method": "GET",
    "path": "/api/v1/product-images/{product_image}",
    "summary": "GET endpoint for product-images show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-images (show)",
    "controller": "ProductImageController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-398",
    "module": "product-images",
    "method": "PUT",
    "path": "/api/v1/product-images/{product_image}",
    "summary": "PUT endpoint for product-images update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-images (update)",
    "controller": "ProductImageController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-399",
    "module": "product-images",
    "method": "DELETE",
    "path": "/api/v1/product-images/{product_image}",
    "summary": "DELETE endpoint for product-images destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-images (destroy)",
    "controller": "ProductImageController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-400",
    "module": "product-prices",
    "method": "GET",
    "path": "/api/v1/product-prices",
    "summary": "GET endpoint for product-prices index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-prices (index)",
    "controller": "ProductPriceController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-401",
    "module": "product-prices",
    "method": "POST",
    "path": "/api/v1/product-prices",
    "summary": "POST endpoint for product-prices store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-prices (store)",
    "controller": "ProductPriceController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-402",
    "module": "product-prices",
    "method": "GET",
    "path": "/api/v1/product-prices/{product_price}",
    "summary": "GET endpoint for product-prices show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-prices (show)",
    "controller": "ProductPriceController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-403",
    "module": "product-prices",
    "method": "PUT",
    "path": "/api/v1/product-prices/{product_price}",
    "summary": "PUT endpoint for product-prices update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-prices (update)",
    "controller": "ProductPriceController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-404",
    "module": "product-prices",
    "method": "DELETE",
    "path": "/api/v1/product-prices/{product_price}",
    "summary": "DELETE endpoint for product-prices destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-prices (destroy)",
    "controller": "ProductPriceController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-405",
    "module": "product-reviews",
    "method": "GET",
    "path": "/api/v1/product-reviews",
    "summary": "GET endpoint for product-reviews index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-reviews (index)",
    "controller": "ProductReviewController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-406",
    "module": "product-reviews",
    "method": "POST",
    "path": "/api/v1/product-reviews",
    "summary": "POST endpoint for product-reviews store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-reviews (store)",
    "controller": "ProductReviewController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-407",
    "module": "product-reviews",
    "method": "GET",
    "path": "/api/v1/product-reviews/{product_review}",
    "summary": "GET endpoint for product-reviews show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-reviews (show)",
    "controller": "ProductReviewController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-408",
    "module": "product-reviews",
    "method": "PUT",
    "path": "/api/v1/product-reviews/{product_review}",
    "summary": "PUT endpoint for product-reviews update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-reviews (update)",
    "controller": "ProductReviewController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-409",
    "module": "product-reviews",
    "method": "DELETE",
    "path": "/api/v1/product-reviews/{product_review}",
    "summary": "DELETE endpoint for product-reviews destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-reviews (destroy)",
    "controller": "ProductReviewController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-410",
    "module": "product-variant-values",
    "method": "GET",
    "path": "/api/v1/product-variant-values",
    "summary": "GET endpoint for product-variant-values index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-variant-values (index)",
    "controller": "ProductVariantValueController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-411",
    "module": "product-variant-values",
    "method": "POST",
    "path": "/api/v1/product-variant-values",
    "summary": "POST endpoint for product-variant-values store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-variant-values (store)",
    "controller": "ProductVariantValueController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-412",
    "module": "product-variant-values",
    "method": "GET",
    "path": "/api/v1/product-variant-values/{product_variant_value}",
    "summary": "GET endpoint for product-variant-values show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-variant-values (show)",
    "controller": "ProductVariantValueController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-413",
    "module": "product-variant-values",
    "method": "PUT",
    "path": "/api/v1/product-variant-values/{product_variant_value}",
    "summary": "PUT endpoint for product-variant-values update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-variant-values (update)",
    "controller": "ProductVariantValueController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-414",
    "module": "product-variant-values",
    "method": "DELETE",
    "path": "/api/v1/product-variant-values/{product_variant_value}",
    "summary": "DELETE endpoint for product-variant-values destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-variant-values (destroy)",
    "controller": "ProductVariantValueController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-415",
    "module": "product-variants",
    "method": "GET",
    "path": "/api/v1/product-variants",
    "summary": "GET endpoint for product-variants index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-variants (index)",
    "controller": "ProductVariantController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-416",
    "module": "product-variants",
    "method": "POST",
    "path": "/api/v1/product-variants",
    "summary": "POST endpoint for product-variants store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-variants (store)",
    "controller": "ProductVariantController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-417",
    "module": "product-variants",
    "method": "POST",
    "path": "/api/v1/product-variants/bulk-delete",
    "summary": "POST endpoint for product-variants bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-variants (bulkDelete)",
    "controller": "ProductVariantController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-418",
    "module": "product-variants",
    "method": "GET",
    "path": "/api/v1/product-variants/{product_variant}",
    "summary": "GET endpoint for product-variants show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-variants (show)",
    "controller": "ProductVariantController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-419",
    "module": "product-variants",
    "method": "PUT",
    "path": "/api/v1/product-variants/{product_variant}",
    "summary": "PUT endpoint for product-variants update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-variants (update)",
    "controller": "ProductVariantController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-420",
    "module": "product-variants",
    "method": "DELETE",
    "path": "/api/v1/product-variants/{product_variant}",
    "summary": "DELETE endpoint for product-variants destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ product-variants (destroy)",
    "controller": "ProductVariantController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-421",
    "module": "products",
    "method": "GET",
    "path": "/api/v1/products",
    "summary": "GET endpoint for products index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ products (index)",
    "controller": "ProductController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-422",
    "module": "products",
    "method": "POST",
    "path": "/api/v1/products",
    "summary": "POST endpoint for products store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ products (store)",
    "controller": "ProductController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-423",
    "module": "products",
    "method": "POST",
    "path": "/api/v1/products/bulk-delete",
    "summary": "POST endpoint for products bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ products (bulkDelete)",
    "controller": "ProductController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-424",
    "module": "products",
    "method": "POST",
    "path": "/api/v1/products/bulk-restore",
    "summary": "POST endpoint for products bulkRestore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ products (bulkRestore)",
    "controller": "ProductController",
    "action": "bulkRestore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-425",
    "module": "products",
    "method": "GET",
    "path": "/api/v1/products/dashboard-statistics",
    "summary": "GET endpoint for products stats",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ products (stats)",
    "controller": "ProductController",
    "action": "stats",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-426",
    "module": "products",
    "method": "GET",
    "path": "/api/v1/products/export",
    "summary": "GET endpoint for products export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ products (export)",
    "controller": "ProductController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-427",
    "module": "products",
    "method": "POST",
    "path": "/api/v1/products/import",
    "summary": "POST endpoint for products import",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ products (import)",
    "controller": "ProductController",
    "action": "import",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-428",
    "module": "products",
    "method": "GET",
    "path": "/api/v1/products/stats",
    "summary": "GET endpoint for products stats",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ products (stats)",
    "controller": "ProductController",
    "action": "stats",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-429",
    "module": "products",
    "method": "DELETE",
    "path": "/api/v1/products/{id}/force",
    "summary": "DELETE endpoint for products forceDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ products (forceDelete)",
    "controller": "ProductController",
    "action": "forceDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-430",
    "module": "products",
    "method": "POST",
    "path": "/api/v1/products/{id}/restore",
    "summary": "POST endpoint for products restore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ products (restore)",
    "controller": "ProductController",
    "action": "restore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-431",
    "module": "products",
    "method": "GET",
    "path": "/api/v1/products/{product}",
    "summary": "GET endpoint for products show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ products (show)",
    "controller": "ProductController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-432",
    "module": "products",
    "method": "PUT",
    "path": "/api/v1/products/{product}",
    "summary": "PUT endpoint for products update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ products (update)",
    "controller": "ProductController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-433",
    "module": "products",
    "method": "DELETE",
    "path": "/api/v1/products/{product}",
    "summary": "DELETE endpoint for products destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ products (destroy)",
    "controller": "ProductController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-434",
    "module": "products",
    "method": "POST",
    "path": "/api/v1/products/{product}/images",
    "summary": "POST endpoint for products uploadImages",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ products (uploadImages)",
    "controller": "ProductController",
    "action": "uploadImages",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-435",
    "module": "products",
    "method": "DELETE",
    "path": "/api/v1/products/{product}/images/{image}",
    "summary": "DELETE endpoint for products deleteImage",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ products (deleteImage)",
    "controller": "ProductController",
    "action": "deleteImage",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-436",
    "module": "products",
    "method": "GET",
    "path": "/api/v1/products/{product}/variants",
    "summary": "GET endpoint for products variants",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ products (variants)",
    "controller": "ProductController",
    "action": "variants",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-437",
    "module": "profile",
    "method": "GET",
    "path": "/api/v1/profile",
    "summary": "GET endpoint for profile show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ profile (show)",
    "controller": "ProfileController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-438",
    "module": "profile",
    "method": "PUT",
    "path": "/api/v1/profile",
    "summary": "PUT endpoint for profile update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ profile (update)",
    "controller": "ProfileController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-439",
    "module": "profile",
    "method": "GET",
    "path": "/api/v1/profile/activity-logs",
    "summary": "GET endpoint for profile activityLogs",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ profile (activityLogs)",
    "controller": "ProfileController",
    "action": "activityLogs",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-440",
    "module": "profile",
    "method": "POST",
    "path": "/api/v1/profile/avatar",
    "summary": "POST endpoint for profile uploadAvatar",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ profile (uploadAvatar)",
    "controller": "ProfileController",
    "action": "uploadAvatar",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-441",
    "module": "profile",
    "method": "DELETE",
    "path": "/api/v1/profile/avatar",
    "summary": "DELETE endpoint for profile removeAvatar",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ profile (removeAvatar)",
    "controller": "ProfileController",
    "action": "removeAvatar",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-442",
    "module": "profile",
    "method": "POST",
    "path": "/api/v1/profile/change-password",
    "summary": "POST endpoint for profile changePassword",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ profile (changePassword)",
    "controller": "ProfileController",
    "action": "changePassword",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-443",
    "module": "profile",
    "method": "GET",
    "path": "/api/v1/profile/login-history",
    "summary": "GET endpoint for profile loginHistory",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ profile (loginHistory)",
    "controller": "ProfileController",
    "action": "loginHistory",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-444",
    "module": "profile",
    "method": "POST",
    "path": "/api/v1/profile/logout-devices",
    "summary": "POST endpoint for profile logoutDevices",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ profile (logoutDevices)",
    "controller": "ProfileController",
    "action": "logoutDevices",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-445",
    "module": "profile",
    "method": "GET",
    "path": "/api/v1/profile/permissions",
    "summary": "GET endpoint for profile permissions",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ profile (permissions)",
    "controller": "ProfileController",
    "action": "permissions",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-446",
    "module": "promotions",
    "method": "GET",
    "path": "/api/v1/promotions",
    "summary": "GET endpoint for promotions index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ promotions (index)",
    "controller": "PromotionController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-447",
    "module": "promotions",
    "method": "POST",
    "path": "/api/v1/promotions",
    "summary": "POST endpoint for promotions store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ promotions (store)",
    "controller": "PromotionController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-448",
    "module": "promotions",
    "method": "GET",
    "path": "/api/v1/promotions/{promotion}",
    "summary": "GET endpoint for promotions show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ promotions (show)",
    "controller": "PromotionController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-449",
    "module": "promotions",
    "method": "PUT",
    "path": "/api/v1/promotions/{promotion}",
    "summary": "PUT endpoint for promotions update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ promotions (update)",
    "controller": "PromotionController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-450",
    "module": "promotions",
    "method": "DELETE",
    "path": "/api/v1/promotions/{promotion}",
    "summary": "DELETE endpoint for promotions destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ promotions (destroy)",
    "controller": "PromotionController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-451",
    "module": "provinces",
    "method": "GET",
    "path": "/api/v1/provinces",
    "summary": "GET endpoint for provinces index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ provinces (index)",
    "controller": "ProvinceController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-452",
    "module": "provinces",
    "method": "POST",
    "path": "/api/v1/provinces",
    "summary": "POST endpoint for provinces store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ provinces (store)",
    "controller": "ProvinceController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-453",
    "module": "provinces",
    "method": "POST",
    "path": "/api/v1/provinces/bulk-delete",
    "summary": "POST endpoint for provinces bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ provinces (bulkDelete)",
    "controller": "ProvinceController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-454",
    "module": "provinces",
    "method": "GET",
    "path": "/api/v1/provinces/{province}",
    "summary": "GET endpoint for provinces show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ provinces (show)",
    "controller": "ProvinceController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-455",
    "module": "provinces",
    "method": "PUT",
    "path": "/api/v1/provinces/{province}",
    "summary": "PUT endpoint for provinces update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ provinces (update)",
    "controller": "ProvinceController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-456",
    "module": "provinces",
    "method": "DELETE",
    "path": "/api/v1/provinces/{province}",
    "summary": "DELETE endpoint for provinces destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ provinces (destroy)",
    "controller": "ProvinceController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-457",
    "module": "public",
    "method": "GET",
    "path": "/api/v1/public/branding",
    "summary": "GET endpoint for public publicBranding",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ public (publicBranding)",
    "controller": "SettingController",
    "action": "publicBranding",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-458",
    "module": "purchase-items",
    "method": "GET",
    "path": "/api/v1/purchase-items",
    "summary": "GET endpoint for purchase-items index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchase-items (index)",
    "controller": "PurchaseItemController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-459",
    "module": "purchase-items",
    "method": "POST",
    "path": "/api/v1/purchase-items",
    "summary": "POST endpoint for purchase-items store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchase-items (store)",
    "controller": "PurchaseItemController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-460",
    "module": "purchase-items",
    "method": "GET",
    "path": "/api/v1/purchase-items/{purchase_item}",
    "summary": "GET endpoint for purchase-items show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchase-items (show)",
    "controller": "PurchaseItemController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-461",
    "module": "purchase-items",
    "method": "PUT",
    "path": "/api/v1/purchase-items/{purchase_item}",
    "summary": "PUT endpoint for purchase-items update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchase-items (update)",
    "controller": "PurchaseItemController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-462",
    "module": "purchase-items",
    "method": "DELETE",
    "path": "/api/v1/purchase-items/{purchase_item}",
    "summary": "DELETE endpoint for purchase-items destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchase-items (destroy)",
    "controller": "PurchaseItemController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-463",
    "module": "purchase-report",
    "method": "GET",
    "path": "/api/v1/purchase-report",
    "summary": "GET endpoint for purchase-report index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchase-report (index)",
    "controller": "PurchaseReportController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-464",
    "module": "purchase-return-items",
    "method": "GET",
    "path": "/api/v1/purchase-return-items",
    "summary": "GET endpoint for purchase-return-items index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchase-return-items (index)",
    "controller": "PurchaseReturnItemController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-465",
    "module": "purchase-return-items",
    "method": "POST",
    "path": "/api/v1/purchase-return-items",
    "summary": "POST endpoint for purchase-return-items store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchase-return-items (store)",
    "controller": "PurchaseReturnItemController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-466",
    "module": "purchase-return-items",
    "method": "GET",
    "path": "/api/v1/purchase-return-items/{purchase_return_item}",
    "summary": "GET endpoint for purchase-return-items show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchase-return-items (show)",
    "controller": "PurchaseReturnItemController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-467",
    "module": "purchase-return-items",
    "method": "PUT",
    "path": "/api/v1/purchase-return-items/{purchase_return_item}",
    "summary": "PUT endpoint for purchase-return-items update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchase-return-items (update)",
    "controller": "PurchaseReturnItemController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-468",
    "module": "purchase-return-items",
    "method": "DELETE",
    "path": "/api/v1/purchase-return-items/{purchase_return_item}",
    "summary": "DELETE endpoint for purchase-return-items destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchase-return-items (destroy)",
    "controller": "PurchaseReturnItemController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-469",
    "module": "purchase-returns",
    "method": "GET",
    "path": "/api/v1/purchase-returns",
    "summary": "GET endpoint for purchase-returns index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchase-returns (index)",
    "controller": "PurchaseReturnController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-470",
    "module": "purchase-returns",
    "method": "POST",
    "path": "/api/v1/purchase-returns",
    "summary": "POST endpoint for purchase-returns store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchase-returns (store)",
    "controller": "PurchaseReturnController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-471",
    "module": "purchase-returns",
    "method": "POST",
    "path": "/api/v1/purchase-returns/bulk-delete",
    "summary": "POST endpoint for purchase-returns bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchase-returns (bulkDelete)",
    "controller": "PurchaseReturnController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-472",
    "module": "purchase-returns",
    "method": "POST",
    "path": "/api/v1/purchase-returns/{id}/approve",
    "summary": "POST endpoint for purchase-returns approve",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchase-returns (approve)",
    "controller": "PurchaseReturnController",
    "action": "approve",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-473",
    "module": "purchase-returns",
    "method": "POST",
    "path": "/api/v1/purchase-returns/{id}/cancel",
    "summary": "POST endpoint for purchase-returns cancel",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchase-returns (cancel)",
    "controller": "PurchaseReturnController",
    "action": "cancel",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-474",
    "module": "purchase-returns",
    "method": "GET",
    "path": "/api/v1/purchase-returns/{purchase_return}",
    "summary": "GET endpoint for purchase-returns show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchase-returns (show)",
    "controller": "PurchaseReturnController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-475",
    "module": "purchase-returns",
    "method": "PUT",
    "path": "/api/v1/purchase-returns/{purchase_return}",
    "summary": "PUT endpoint for purchase-returns update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchase-returns (update)",
    "controller": "PurchaseReturnController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-476",
    "module": "purchase-returns",
    "method": "DELETE",
    "path": "/api/v1/purchase-returns/{purchase_return}",
    "summary": "DELETE endpoint for purchase-returns destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchase-returns (destroy)",
    "controller": "PurchaseReturnController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-477",
    "module": "purchases",
    "method": "GET",
    "path": "/api/v1/purchases",
    "summary": "GET endpoint for purchases index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchases (index)",
    "controller": "PurchaseController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-478",
    "module": "purchases",
    "method": "POST",
    "path": "/api/v1/purchases",
    "summary": "POST endpoint for purchases store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchases (store)",
    "controller": "PurchaseController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-479",
    "module": "purchases",
    "method": "GET",
    "path": "/api/v1/purchases/returns",
    "summary": "GET endpoint for purchases index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchases (index)",
    "controller": "PurchaseReturnController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-480",
    "module": "purchases",
    "method": "POST",
    "path": "/api/v1/purchases/{id}/cancel",
    "summary": "POST endpoint for purchases cancel",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchases (cancel)",
    "controller": "PurchaseController",
    "action": "cancel",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-481",
    "module": "purchases",
    "method": "POST",
    "path": "/api/v1/purchases/{id}/receive",
    "summary": "POST endpoint for purchases receive",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchases (receive)",
    "controller": "PurchaseController",
    "action": "receive",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-482",
    "module": "purchases",
    "method": "POST",
    "path": "/api/v1/purchases/{id}/record-payment",
    "summary": "POST endpoint for purchases recordPayment",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchases (recordPayment)",
    "controller": "PurchaseController",
    "action": "recordPayment",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-483",
    "module": "purchases",
    "method": "GET",
    "path": "/api/v1/purchases/{purchase}",
    "summary": "GET endpoint for purchases show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchases (show)",
    "controller": "PurchaseController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-484",
    "module": "purchases",
    "method": "PUT",
    "path": "/api/v1/purchases/{purchase}",
    "summary": "PUT endpoint for purchases update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchases (update)",
    "controller": "PurchaseController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-485",
    "module": "purchases",
    "method": "DELETE",
    "path": "/api/v1/purchases/{purchase}",
    "summary": "DELETE endpoint for purchases destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchases (destroy)",
    "controller": "PurchaseController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-486",
    "module": "purchases",
    "method": "GET",
    "path": "/api/v1/purchases/{purchase}/returns",
    "summary": "GET endpoint for purchases index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchases (index)",
    "controller": "PurchaseReturnController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-487",
    "module": "purchases",
    "method": "POST",
    "path": "/api/v1/purchases/{purchase}/returns",
    "summary": "POST endpoint for purchases store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchases (store)",
    "controller": "PurchaseReturnController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-488",
    "module": "purchases",
    "method": "GET",
    "path": "/api/v1/purchases/{purchase}/returns/{return}",
    "summary": "GET endpoint for purchases show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchases (show)",
    "controller": "PurchaseReturnController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-489",
    "module": "purchases",
    "method": "PUT",
    "path": "/api/v1/purchases/{purchase}/returns/{return}",
    "summary": "PUT endpoint for purchases update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchases (update)",
    "controller": "PurchaseReturnController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-490",
    "module": "purchases",
    "method": "DELETE",
    "path": "/api/v1/purchases/{purchase}/returns/{return}",
    "summary": "DELETE endpoint for purchases destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ purchases (destroy)",
    "controller": "PurchaseReturnController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-491",
    "module": "recycle-bin",
    "method": "GET",
    "path": "/api/v1/recycle-bin/dashboard",
    "summary": "GET endpoint for recycle-bin stats",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ recycle-bin (stats)",
    "controller": "RecycleBinController",
    "action": "stats",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-492",
    "module": "recycle-bin",
    "method": "GET",
    "path": "/api/v1/recycle-bin/stats",
    "summary": "GET endpoint for recycle-bin stats",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ recycle-bin (stats)",
    "controller": "RecycleBinController",
    "action": "stats",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-493",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/customers",
    "summary": "GET endpoint for reports customers",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (customers)",
    "controller": "ReportController",
    "action": "customers",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-494",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/expenses",
    "summary": "GET endpoint for reports expenses",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (expenses)",
    "controller": "ReportController",
    "action": "expenses",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-495",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/export-inventory",
    "summary": "GET endpoint for reports export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (export)",
    "controller": "InventoryReportController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-496",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/export-sales",
    "summary": "GET endpoint for reports export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (export)",
    "controller": "SalesReportController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-497",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/inventory",
    "summary": "GET endpoint for reports overview",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (overview)",
    "controller": "InventoryReportController",
    "action": "overview",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-498",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/inventory/aging",
    "summary": "GET endpoint for reports overview",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (overview)",
    "controller": "InventoryReportController",
    "action": "overview",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-499",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/inventory/brands",
    "summary": "GET endpoint for reports overview",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (overview)",
    "controller": "InventoryReportController",
    "action": "overview",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-500",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/inventory/categories",
    "summary": "GET endpoint for reports overview",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (overview)",
    "controller": "InventoryReportController",
    "action": "overview",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-501",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/inventory/dashboard",
    "summary": "GET endpoint for reports overview",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (overview)",
    "controller": "InventoryReportController",
    "action": "overview",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-502",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/inventory/export",
    "summary": "GET endpoint for reports export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (export)",
    "controller": "InventoryReportController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-503",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/inventory/low-stock",
    "summary": "GET endpoint for reports valuation",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (valuation)",
    "controller": "InventoryReportController",
    "action": "valuation",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-504",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/inventory/movement-trend",
    "summary": "GET endpoint for reports overview",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (overview)",
    "controller": "InventoryReportController",
    "action": "overview",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-505",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/inventory/movements",
    "summary": "GET endpoint for reports movements",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (movements)",
    "controller": "InventoryReportController",
    "action": "movements",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-506",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/inventory/overview",
    "summary": "GET endpoint for reports overview",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (overview)",
    "controller": "InventoryReportController",
    "action": "overview",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-507",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/inventory/status",
    "summary": "GET endpoint for reports overview",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (overview)",
    "controller": "InventoryReportController",
    "action": "overview",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-508",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/inventory/turnover",
    "summary": "GET endpoint for reports valuation",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (valuation)",
    "controller": "InventoryReportController",
    "action": "valuation",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-509",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/inventory/valuation",
    "summary": "GET endpoint for reports valuation",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (valuation)",
    "controller": "InventoryReportController",
    "action": "valuation",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-510",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/inventory/value-trend",
    "summary": "GET endpoint for reports overview",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (overview)",
    "controller": "InventoryReportController",
    "action": "overview",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-511",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/inventory/warehouse-summary",
    "summary": "GET endpoint for reports overview",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (overview)",
    "controller": "InventoryReportController",
    "action": "overview",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-512",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/inventory/warehouses",
    "summary": "GET endpoint for reports overview",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (overview)",
    "controller": "InventoryReportController",
    "action": "overview",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-513",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/products",
    "summary": "GET endpoint for reports products",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (products)",
    "controller": "ReportController",
    "action": "products",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-514",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/profit-loss",
    "summary": "GET endpoint for reports profitLoss",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (profitLoss)",
    "controller": "ReportController",
    "action": "profitLoss",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-515",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/purchase/brands",
    "summary": "GET endpoint for reports brands",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (brands)",
    "controller": "PurchaseReportController",
    "action": "brands",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-516",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/purchase/categories",
    "summary": "GET endpoint for reports categories",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (categories)",
    "controller": "PurchaseReportController",
    "action": "categories",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-517",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/purchase/dashboard",
    "summary": "GET endpoint for reports dashboard",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (dashboard)",
    "controller": "PurchaseReportController",
    "action": "dashboard",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-518",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/purchase/export",
    "summary": "GET endpoint for reports export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (export)",
    "controller": "PurchaseReportController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-519",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/purchase/overview",
    "summary": "GET endpoint for reports overview",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (overview)",
    "controller": "PurchaseReportController",
    "action": "overview",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-520",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/purchase/payment-status",
    "summary": "GET endpoint for reports paymentStatus",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (paymentStatus)",
    "controller": "PurchaseReportController",
    "action": "paymentStatus",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-521",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/purchase/products",
    "summary": "GET endpoint for reports products",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (products)",
    "controller": "PurchaseReportController",
    "action": "products",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-522",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/purchase/returns",
    "summary": "GET endpoint for reports returns",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (returns)",
    "controller": "PurchaseReportController",
    "action": "returns",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-523",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/purchase/returns-table",
    "summary": "GET endpoint for reports returnsTable",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (returnsTable)",
    "controller": "PurchaseReportController",
    "action": "returnsTable",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-524",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/purchase/status",
    "summary": "GET endpoint for reports status",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (status)",
    "controller": "PurchaseReportController",
    "action": "status",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-525",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/purchase/suppliers",
    "summary": "GET endpoint for reports suppliers",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (suppliers)",
    "controller": "PurchaseReportController",
    "action": "suppliers",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-526",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/purchase/table",
    "summary": "GET endpoint for reports table",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (table)",
    "controller": "PurchaseReportController",
    "action": "table",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-527",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/purchase/trend",
    "summary": "GET endpoint for reports trend",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (trend)",
    "controller": "PurchaseReportController",
    "action": "trend",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-528",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/purchase/warehouses",
    "summary": "GET endpoint for reports warehouses",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (warehouses)",
    "controller": "PurchaseReportController",
    "action": "warehouses",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-529",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/purchases",
    "summary": "GET endpoint for reports purchases",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (purchases)",
    "controller": "ReportController",
    "action": "purchases",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-530",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/sales",
    "summary": "GET endpoint for reports dashboard",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (dashboard)",
    "controller": "SalesReportController",
    "action": "dashboard",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-531",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/sales/brands",
    "summary": "GET endpoint for reports brands",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (brands)",
    "controller": "SalesReportController",
    "action": "brands",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-532",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/sales/categories",
    "summary": "GET endpoint for reports categories",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (categories)",
    "controller": "SalesReportController",
    "action": "categories",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-533",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/sales/dashboard",
    "summary": "GET endpoint for reports dashboard",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (dashboard)",
    "controller": "SalesReportController",
    "action": "dashboard",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-534",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/sales/export",
    "summary": "GET endpoint for reports export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (export)",
    "controller": "SalesReportController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-535",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/sales/list",
    "summary": "GET endpoint for reports list",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (list)",
    "controller": "SalesReportController",
    "action": "list",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-536",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/sales/overview",
    "summary": "GET endpoint for reports overview",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (overview)",
    "controller": "SalesReportController",
    "action": "overview",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-537",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/sales/payment-methods",
    "summary": "GET endpoint for reports paymentMethods",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (paymentMethods)",
    "controller": "SalesReportController",
    "action": "paymentMethods",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-538",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/sales/top-customers",
    "summary": "GET endpoint for reports topCustomers",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (topCustomers)",
    "controller": "SalesReportController",
    "action": "topCustomers",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-539",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/sales/top-products",
    "summary": "GET endpoint for reports topProducts",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (topProducts)",
    "controller": "SalesReportController",
    "action": "topProducts",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-540",
    "module": "reports",
    "method": "GET",
    "path": "/api/v1/reports/sales/trend",
    "summary": "GET endpoint for reports trend",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reports (trend)",
    "controller": "SalesReportController",
    "action": "trend",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-541",
    "module": "reviews",
    "method": "GET",
    "path": "/api/v1/reviews",
    "summary": "GET endpoint for reviews index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reviews (index)",
    "controller": "ReviewController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-542",
    "module": "reviews",
    "method": "DELETE",
    "path": "/api/v1/reviews/{id}",
    "summary": "DELETE endpoint for reviews destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reviews (destroy)",
    "controller": "ReviewController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-543",
    "module": "reviews",
    "method": "POST",
    "path": "/api/v1/reviews/{id}/approve",
    "summary": "POST endpoint for reviews approve",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reviews (approve)",
    "controller": "ReviewController",
    "action": "approve",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-544",
    "module": "reviews",
    "method": "POST",
    "path": "/api/v1/reviews/{id}/reject",
    "summary": "POST endpoint for reviews reject",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ reviews (reject)",
    "controller": "ReviewController",
    "action": "reject",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-545",
    "module": "roles",
    "method": "GET",
    "path": "/api/v1/roles",
    "summary": "GET endpoint for roles index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ roles (index)",
    "controller": "RoleController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-546",
    "module": "roles",
    "method": "POST",
    "path": "/api/v1/roles",
    "summary": "POST endpoint for roles store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ roles (store)",
    "controller": "RoleController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-547",
    "module": "roles",
    "method": "GET",
    "path": "/api/v1/roles/dashboard",
    "summary": "GET endpoint for roles stats",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ roles (stats)",
    "controller": "RoleController",
    "action": "stats",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-548",
    "module": "roles",
    "method": "GET",
    "path": "/api/v1/roles/stats",
    "summary": "GET endpoint for roles stats",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ roles (stats)",
    "controller": "RoleController",
    "action": "stats",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-549",
    "module": "roles",
    "method": "GET",
    "path": "/api/v1/roles/{role}",
    "summary": "GET endpoint for roles show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ roles (show)",
    "controller": "RoleController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-550",
    "module": "roles",
    "method": "PUT",
    "path": "/api/v1/roles/{role}",
    "summary": "PUT endpoint for roles update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ roles (update)",
    "controller": "RoleController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-551",
    "module": "roles",
    "method": "DELETE",
    "path": "/api/v1/roles/{role}",
    "summary": "DELETE endpoint for roles destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ roles (destroy)",
    "controller": "RoleController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-552",
    "module": "sale-items",
    "method": "GET",
    "path": "/api/v1/sale-items",
    "summary": "GET endpoint for sale-items index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ sale-items (index)",
    "controller": "SaleItemController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-553",
    "module": "sale-items",
    "method": "POST",
    "path": "/api/v1/sale-items",
    "summary": "POST endpoint for sale-items store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ sale-items (store)",
    "controller": "SaleItemController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-554",
    "module": "sale-items",
    "method": "GET",
    "path": "/api/v1/sale-items/{sale_item}",
    "summary": "GET endpoint for sale-items show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ sale-items (show)",
    "controller": "SaleItemController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-555",
    "module": "sale-items",
    "method": "PUT",
    "path": "/api/v1/sale-items/{sale_item}",
    "summary": "PUT endpoint for sale-items update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ sale-items (update)",
    "controller": "SaleItemController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-556",
    "module": "sale-items",
    "method": "DELETE",
    "path": "/api/v1/sale-items/{sale_item}",
    "summary": "DELETE endpoint for sale-items destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ sale-items (destroy)",
    "controller": "SaleItemController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-557",
    "module": "sale-return-items",
    "method": "GET",
    "path": "/api/v1/sale-return-items",
    "summary": "GET endpoint for sale-return-items index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ sale-return-items (index)",
    "controller": "SaleReturnItemController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-558",
    "module": "sale-return-items",
    "method": "POST",
    "path": "/api/v1/sale-return-items",
    "summary": "POST endpoint for sale-return-items store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ sale-return-items (store)",
    "controller": "SaleReturnItemController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-559",
    "module": "sale-return-items",
    "method": "GET",
    "path": "/api/v1/sale-return-items/{sale_return_item}",
    "summary": "GET endpoint for sale-return-items show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ sale-return-items (show)",
    "controller": "SaleReturnItemController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-560",
    "module": "sale-return-items",
    "method": "PUT",
    "path": "/api/v1/sale-return-items/{sale_return_item}",
    "summary": "PUT endpoint for sale-return-items update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ sale-return-items (update)",
    "controller": "SaleReturnItemController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-561",
    "module": "sale-return-items",
    "method": "DELETE",
    "path": "/api/v1/sale-return-items/{sale_return_item}",
    "summary": "DELETE endpoint for sale-return-items destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ sale-return-items (destroy)",
    "controller": "SaleReturnItemController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-562",
    "module": "sale-returns",
    "method": "GET",
    "path": "/api/v1/sale-returns",
    "summary": "GET endpoint for sale-returns index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ sale-returns (index)",
    "controller": "SaleReturnController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-563",
    "module": "sale-returns",
    "method": "POST",
    "path": "/api/v1/sale-returns",
    "summary": "POST endpoint for sale-returns store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ sale-returns (store)",
    "controller": "SaleReturnController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-564",
    "module": "sale-returns",
    "method": "GET",
    "path": "/api/v1/sale-returns/{sale_return}",
    "summary": "GET endpoint for sale-returns show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ sale-returns (show)",
    "controller": "SaleReturnController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-565",
    "module": "sale-returns",
    "method": "PUT",
    "path": "/api/v1/sale-returns/{sale_return}",
    "summary": "PUT endpoint for sale-returns update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ sale-returns (update)",
    "controller": "SaleReturnController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-566",
    "module": "sale-returns",
    "method": "DELETE",
    "path": "/api/v1/sale-returns/{sale_return}",
    "summary": "DELETE endpoint for sale-returns destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ sale-returns (destroy)",
    "controller": "SaleReturnController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-567",
    "module": "sales",
    "method": "GET",
    "path": "/api/v1/sales",
    "summary": "GET endpoint for sales index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ sales (index)",
    "controller": "SaleController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-568",
    "module": "sales",
    "method": "POST",
    "path": "/api/v1/sales",
    "summary": "POST endpoint for sales store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ sales (store)",
    "controller": "SaleController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-569",
    "module": "sales",
    "method": "GET",
    "path": "/api/v1/sales/{sale}",
    "summary": "GET endpoint for sales show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ sales (show)",
    "controller": "SaleController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-570",
    "module": "sales",
    "method": "PUT",
    "path": "/api/v1/sales/{sale}",
    "summary": "PUT endpoint for sales update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ sales (update)",
    "controller": "SaleController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-571",
    "module": "sales",
    "method": "DELETE",
    "path": "/api/v1/sales/{sale}",
    "summary": "DELETE endpoint for sales destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ sales (destroy)",
    "controller": "SaleController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-572",
    "module": "security",
    "method": "GET",
    "path": "/api/v1/security/overview",
    "summary": "GET endpoint for security overview",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ security (overview)",
    "controller": "SecurityController",
    "action": "overview",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-573",
    "module": "security",
    "method": "POST",
    "path": "/api/v1/security/set-manager-pin",
    "summary": "POST endpoint for security setManagerPin",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ security (setManagerPin)",
    "controller": "SecurityController",
    "action": "setManagerPin",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-574",
    "module": "security",
    "method": "GET",
    "path": "/api/v1/security/settings",
    "summary": "GET endpoint for security settings",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ security (settings)",
    "controller": "SecurityController",
    "action": "settings",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-575",
    "module": "security",
    "method": "PUT",
    "path": "/api/v1/security/settings",
    "summary": "PUT endpoint for security updateSettings",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ security (updateSettings)",
    "controller": "SecurityController",
    "action": "updateSettings",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-576",
    "module": "security",
    "method": "POST",
    "path": "/api/v1/security/verify-manager-pin",
    "summary": "POST endpoint for security verifyManagerPin",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ security (verifyManagerPin)",
    "controller": "SecurityController",
    "action": "verifyManagerPin",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-577",
    "module": "settings",
    "method": "GET",
    "path": "/api/v1/settings",
    "summary": "GET endpoint for settings index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ settings (index)",
    "controller": "SettingController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-578",
    "module": "settings",
    "method": "POST",
    "path": "/api/v1/settings",
    "summary": "POST endpoint for settings bulkUpdate",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ settings (bulkUpdate)",
    "controller": "SettingController",
    "action": "bulkUpdate",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-579",
    "module": "settings",
    "method": "POST",
    "path": "/api/v1/settings/logo",
    "summary": "POST endpoint for settings uploadLogo",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ settings (uploadLogo)",
    "controller": "SettingController",
    "action": "uploadLogo",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-580",
    "module": "settings",
    "method": "DELETE",
    "path": "/api/v1/settings/logo",
    "summary": "DELETE endpoint for settings removeLogo",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ settings (removeLogo)",
    "controller": "SettingController",
    "action": "removeLogo",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-581",
    "module": "settings",
    "method": "GET",
    "path": "/api/v1/settings/{key}",
    "summary": "GET endpoint for settings show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ settings (show)",
    "controller": "SettingController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-582",
    "module": "settings",
    "method": "PUT",
    "path": "/api/v1/settings/{key}",
    "summary": "PUT endpoint for settings update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ settings (update)",
    "controller": "SettingController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-583",
    "module": "shifts",
    "method": "GET",
    "path": "/api/v1/shifts",
    "summary": "GET endpoint for shifts index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shifts (index)",
    "controller": "ShiftController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-584",
    "module": "shifts",
    "method": "POST",
    "path": "/api/v1/shifts",
    "summary": "POST endpoint for shifts store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shifts (store)",
    "controller": "ShiftController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-585",
    "module": "shifts",
    "method": "GET",
    "path": "/api/v1/shifts/{shift}",
    "summary": "GET endpoint for shifts show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shifts (show)",
    "controller": "ShiftController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-586",
    "module": "shifts",
    "method": "PUT",
    "path": "/api/v1/shifts/{shift}",
    "summary": "PUT endpoint for shifts update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shifts (update)",
    "controller": "ShiftController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-587",
    "module": "shifts",
    "method": "DELETE",
    "path": "/api/v1/shifts/{shift}",
    "summary": "DELETE endpoint for shifts destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shifts (destroy)",
    "controller": "ShiftController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-588",
    "module": "shipments",
    "method": "GET",
    "path": "/api/v1/shipments",
    "summary": "GET endpoint for shipments index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shipments (index)",
    "controller": "ShipmentController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-589",
    "module": "shipments",
    "method": "POST",
    "path": "/api/v1/shipments",
    "summary": "POST endpoint for shipments store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shipments (store)",
    "controller": "ShipmentController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-590",
    "module": "shipments",
    "method": "GET",
    "path": "/api/v1/shipments/{shipment}",
    "summary": "GET endpoint for shipments show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shipments (show)",
    "controller": "ShipmentController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-591",
    "module": "shipments",
    "method": "PUT",
    "path": "/api/v1/shipments/{shipment}",
    "summary": "PUT endpoint for shipments update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shipments (update)",
    "controller": "ShipmentController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-592",
    "module": "shipments",
    "method": "DELETE",
    "path": "/api/v1/shipments/{shipment}",
    "summary": "DELETE endpoint for shipments destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shipments (destroy)",
    "controller": "ShipmentController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-593",
    "module": "shipping-methods",
    "method": "GET",
    "path": "/api/v1/shipping-methods",
    "summary": "GET endpoint for shipping-methods index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shipping-methods (index)",
    "controller": "ShippingMethodController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-594",
    "module": "shipping-methods",
    "method": "POST",
    "path": "/api/v1/shipping-methods",
    "summary": "POST endpoint for shipping-methods store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shipping-methods (store)",
    "controller": "ShippingMethodController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-595",
    "module": "shipping-methods",
    "method": "GET",
    "path": "/api/v1/shipping-methods/{shipping_method}",
    "summary": "GET endpoint for shipping-methods show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shipping-methods (show)",
    "controller": "ShippingMethodController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-596",
    "module": "shipping-methods",
    "method": "PUT",
    "path": "/api/v1/shipping-methods/{shipping_method}",
    "summary": "PUT endpoint for shipping-methods update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shipping-methods (update)",
    "controller": "ShippingMethodController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-597",
    "module": "shipping-methods",
    "method": "DELETE",
    "path": "/api/v1/shipping-methods/{shipping_method}",
    "summary": "DELETE endpoint for shipping-methods destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shipping-methods (destroy)",
    "controller": "ShippingMethodController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-598",
    "module": "shipping-rates",
    "method": "GET",
    "path": "/api/v1/shipping-rates",
    "summary": "GET endpoint for shipping-rates index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shipping-rates (index)",
    "controller": "ShippingRateController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-599",
    "module": "shipping-rates",
    "method": "POST",
    "path": "/api/v1/shipping-rates",
    "summary": "POST endpoint for shipping-rates store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shipping-rates (store)",
    "controller": "ShippingRateController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-600",
    "module": "shipping-rates",
    "method": "GET",
    "path": "/api/v1/shipping-rates/{shipping_rate}",
    "summary": "GET endpoint for shipping-rates show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shipping-rates (show)",
    "controller": "ShippingRateController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-601",
    "module": "shipping-rates",
    "method": "PUT",
    "path": "/api/v1/shipping-rates/{shipping_rate}",
    "summary": "PUT endpoint for shipping-rates update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shipping-rates (update)",
    "controller": "ShippingRateController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-602",
    "module": "shipping-rates",
    "method": "DELETE",
    "path": "/api/v1/shipping-rates/{shipping_rate}",
    "summary": "DELETE endpoint for shipping-rates destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shipping-rates (destroy)",
    "controller": "ShippingRateController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-603",
    "module": "shipping-zones",
    "method": "GET",
    "path": "/api/v1/shipping-zones",
    "summary": "GET endpoint for shipping-zones index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shipping-zones (index)",
    "controller": "ShippingZoneController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-604",
    "module": "shipping-zones",
    "method": "POST",
    "path": "/api/v1/shipping-zones",
    "summary": "POST endpoint for shipping-zones store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shipping-zones (store)",
    "controller": "ShippingZoneController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-605",
    "module": "shipping-zones",
    "method": "GET",
    "path": "/api/v1/shipping-zones/{shipping_zone}",
    "summary": "GET endpoint for shipping-zones show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shipping-zones (show)",
    "controller": "ShippingZoneController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-606",
    "module": "shipping-zones",
    "method": "PUT",
    "path": "/api/v1/shipping-zones/{shipping_zone}",
    "summary": "PUT endpoint for shipping-zones update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shipping-zones (update)",
    "controller": "ShippingZoneController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-607",
    "module": "shipping-zones",
    "method": "DELETE",
    "path": "/api/v1/shipping-zones/{shipping_zone}",
    "summary": "DELETE endpoint for shipping-zones destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ shipping-zones (destroy)",
    "controller": "ShippingZoneController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-608",
    "module": "stock-adjustment-items",
    "method": "GET",
    "path": "/api/v1/stock-adjustment-items",
    "summary": "GET endpoint for stock-adjustment-items index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-adjustment-items (index)",
    "controller": "StockAdjustmentItemController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-609",
    "module": "stock-adjustment-items",
    "method": "POST",
    "path": "/api/v1/stock-adjustment-items",
    "summary": "POST endpoint for stock-adjustment-items store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-adjustment-items (store)",
    "controller": "StockAdjustmentItemController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-610",
    "module": "stock-adjustment-items",
    "method": "GET",
    "path": "/api/v1/stock-adjustment-items/{stock_adjustment_item}",
    "summary": "GET endpoint for stock-adjustment-items show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-adjustment-items (show)",
    "controller": "StockAdjustmentItemController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-611",
    "module": "stock-adjustment-items",
    "method": "PUT",
    "path": "/api/v1/stock-adjustment-items/{stock_adjustment_item}",
    "summary": "PUT endpoint for stock-adjustment-items update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-adjustment-items (update)",
    "controller": "StockAdjustmentItemController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-612",
    "module": "stock-adjustment-items",
    "method": "DELETE",
    "path": "/api/v1/stock-adjustment-items/{stock_adjustment_item}",
    "summary": "DELETE endpoint for stock-adjustment-items destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-adjustment-items (destroy)",
    "controller": "StockAdjustmentItemController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-613",
    "module": "stock-adjustments",
    "method": "GET",
    "path": "/api/v1/stock-adjustments",
    "summary": "GET endpoint for stock-adjustments index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-adjustments (index)",
    "controller": "StockAdjustmentController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-614",
    "module": "stock-adjustments",
    "method": "POST",
    "path": "/api/v1/stock-adjustments",
    "summary": "POST endpoint for stock-adjustments store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-adjustments (store)",
    "controller": "StockAdjustmentController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-615",
    "module": "stock-adjustments",
    "method": "POST",
    "path": "/api/v1/stock-adjustments/bulk-delete",
    "summary": "POST endpoint for stock-adjustments bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-adjustments (bulkDelete)",
    "controller": "StockAdjustmentController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-616",
    "module": "stock-adjustments",
    "method": "POST",
    "path": "/api/v1/stock-adjustments/bulk-restore",
    "summary": "POST endpoint for stock-adjustments bulkRestore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-adjustments (bulkRestore)",
    "controller": "StockAdjustmentController",
    "action": "bulkRestore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-617",
    "module": "stock-adjustments",
    "method": "GET",
    "path": "/api/v1/stock-adjustments/export",
    "summary": "GET endpoint for stock-adjustments export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-adjustments (export)",
    "controller": "StockAdjustmentController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-618",
    "module": "stock-adjustments",
    "method": "POST",
    "path": "/api/v1/stock-adjustments/import",
    "summary": "POST endpoint for stock-adjustments import",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-adjustments (import)",
    "controller": "StockAdjustmentController",
    "action": "import",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-619",
    "module": "stock-adjustments",
    "method": "POST",
    "path": "/api/v1/stock-adjustments/{id}/approve",
    "summary": "POST endpoint for stock-adjustments approve",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-adjustments (approve)",
    "controller": "StockAdjustmentController",
    "action": "approve",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-620",
    "module": "stock-adjustments",
    "method": "DELETE",
    "path": "/api/v1/stock-adjustments/{id}/force",
    "summary": "DELETE endpoint for stock-adjustments forceDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-adjustments (forceDelete)",
    "controller": "StockAdjustmentController",
    "action": "forceDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-621",
    "module": "stock-adjustments",
    "method": "POST",
    "path": "/api/v1/stock-adjustments/{id}/restore",
    "summary": "POST endpoint for stock-adjustments restore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-adjustments (restore)",
    "controller": "StockAdjustmentController",
    "action": "restore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-622",
    "module": "stock-adjustments",
    "method": "GET",
    "path": "/api/v1/stock-adjustments/{stock_adjustment}",
    "summary": "GET endpoint for stock-adjustments show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-adjustments (show)",
    "controller": "StockAdjustmentController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-623",
    "module": "stock-adjustments",
    "method": "PUT",
    "path": "/api/v1/stock-adjustments/{stock_adjustment}",
    "summary": "PUT endpoint for stock-adjustments update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-adjustments (update)",
    "controller": "StockAdjustmentController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-624",
    "module": "stock-adjustments",
    "method": "DELETE",
    "path": "/api/v1/stock-adjustments/{stock_adjustment}",
    "summary": "DELETE endpoint for stock-adjustments destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-adjustments (destroy)",
    "controller": "StockAdjustmentController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-625",
    "module": "stock-opname-items",
    "method": "GET",
    "path": "/api/v1/stock-opname-items",
    "summary": "GET endpoint for stock-opname-items index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-opname-items (index)",
    "controller": "StockOpnameItemController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-626",
    "module": "stock-opname-items",
    "method": "POST",
    "path": "/api/v1/stock-opname-items",
    "summary": "POST endpoint for stock-opname-items store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-opname-items (store)",
    "controller": "StockOpnameItemController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-627",
    "module": "stock-opname-items",
    "method": "GET",
    "path": "/api/v1/stock-opname-items/{stock_opname_item}",
    "summary": "GET endpoint for stock-opname-items show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-opname-items (show)",
    "controller": "StockOpnameItemController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-628",
    "module": "stock-opname-items",
    "method": "PUT",
    "path": "/api/v1/stock-opname-items/{stock_opname_item}",
    "summary": "PUT endpoint for stock-opname-items update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-opname-items (update)",
    "controller": "StockOpnameItemController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-629",
    "module": "stock-opname-items",
    "method": "DELETE",
    "path": "/api/v1/stock-opname-items/{stock_opname_item}",
    "summary": "DELETE endpoint for stock-opname-items destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-opname-items (destroy)",
    "controller": "StockOpnameItemController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-630",
    "module": "stock-opnames",
    "method": "GET",
    "path": "/api/v1/stock-opnames",
    "summary": "GET endpoint for stock-opnames index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-opnames (index)",
    "controller": "StockOpnameController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-631",
    "module": "stock-opnames",
    "method": "POST",
    "path": "/api/v1/stock-opnames",
    "summary": "POST endpoint for stock-opnames store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-opnames (store)",
    "controller": "StockOpnameController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-632",
    "module": "stock-opnames",
    "method": "POST",
    "path": "/api/v1/stock-opnames/bulk-delete",
    "summary": "POST endpoint for stock-opnames bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-opnames (bulkDelete)",
    "controller": "StockOpnameController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-633",
    "module": "stock-opnames",
    "method": "POST",
    "path": "/api/v1/stock-opnames/bulk-restore",
    "summary": "POST endpoint for stock-opnames bulkRestore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-opnames (bulkRestore)",
    "controller": "StockOpnameController",
    "action": "bulkRestore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-634",
    "module": "stock-opnames",
    "method": "GET",
    "path": "/api/v1/stock-opnames/export",
    "summary": "GET endpoint for stock-opnames export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-opnames (export)",
    "controller": "StockOpnameController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-635",
    "module": "stock-opnames",
    "method": "POST",
    "path": "/api/v1/stock-opnames/import",
    "summary": "POST endpoint for stock-opnames import",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-opnames (import)",
    "controller": "StockOpnameController",
    "action": "import",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-636",
    "module": "stock-opnames",
    "method": "POST",
    "path": "/api/v1/stock-opnames/{id}/complete",
    "summary": "POST endpoint for stock-opnames complete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-opnames (complete)",
    "controller": "StockOpnameController",
    "action": "complete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-637",
    "module": "stock-opnames",
    "method": "DELETE",
    "path": "/api/v1/stock-opnames/{id}/force",
    "summary": "DELETE endpoint for stock-opnames forceDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-opnames (forceDelete)",
    "controller": "StockOpnameController",
    "action": "forceDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-638",
    "module": "stock-opnames",
    "method": "POST",
    "path": "/api/v1/stock-opnames/{id}/restore",
    "summary": "POST endpoint for stock-opnames restore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-opnames (restore)",
    "controller": "StockOpnameController",
    "action": "restore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-639",
    "module": "stock-opnames",
    "method": "GET",
    "path": "/api/v1/stock-opnames/{stock_opname}",
    "summary": "GET endpoint for stock-opnames show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-opnames (show)",
    "controller": "StockOpnameController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-640",
    "module": "stock-opnames",
    "method": "PUT",
    "path": "/api/v1/stock-opnames/{stock_opname}",
    "summary": "PUT endpoint for stock-opnames update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-opnames (update)",
    "controller": "StockOpnameController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-641",
    "module": "stock-opnames",
    "method": "DELETE",
    "path": "/api/v1/stock-opnames/{stock_opname}",
    "summary": "DELETE endpoint for stock-opnames destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-opnames (destroy)",
    "controller": "StockOpnameController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-642",
    "module": "stock-transfers",
    "method": "GET",
    "path": "/api/v1/stock-transfers",
    "summary": "GET endpoint for stock-transfers index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-transfers (index)",
    "controller": "StockTransferController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-643",
    "module": "stock-transfers",
    "method": "POST",
    "path": "/api/v1/stock-transfers",
    "summary": "POST endpoint for stock-transfers store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-transfers (store)",
    "controller": "StockTransferController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-644",
    "module": "stock-transfers",
    "method": "POST",
    "path": "/api/v1/stock-transfers/bulk-delete",
    "summary": "POST endpoint for stock-transfers bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-transfers (bulkDelete)",
    "controller": "StockTransferController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-645",
    "module": "stock-transfers",
    "method": "POST",
    "path": "/api/v1/stock-transfers/bulk-restore",
    "summary": "POST endpoint for stock-transfers bulkRestore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-transfers (bulkRestore)",
    "controller": "StockTransferController",
    "action": "bulkRestore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-646",
    "module": "stock-transfers",
    "method": "GET",
    "path": "/api/v1/stock-transfers/export",
    "summary": "GET endpoint for stock-transfers export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-transfers (export)",
    "controller": "StockTransferController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-647",
    "module": "stock-transfers",
    "method": "POST",
    "path": "/api/v1/stock-transfers/import",
    "summary": "POST endpoint for stock-transfers import",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-transfers (import)",
    "controller": "StockTransferController",
    "action": "import",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-648",
    "module": "stock-transfers",
    "method": "DELETE",
    "path": "/api/v1/stock-transfers/{id}/force",
    "summary": "DELETE endpoint for stock-transfers forceDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-transfers (forceDelete)",
    "controller": "StockTransferController",
    "action": "forceDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-649",
    "module": "stock-transfers",
    "method": "POST",
    "path": "/api/v1/stock-transfers/{id}/receive",
    "summary": "POST endpoint for stock-transfers receive",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-transfers (receive)",
    "controller": "StockTransferController",
    "action": "receive",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-650",
    "module": "stock-transfers",
    "method": "POST",
    "path": "/api/v1/stock-transfers/{id}/restore",
    "summary": "POST endpoint for stock-transfers restore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-transfers (restore)",
    "controller": "StockTransferController",
    "action": "restore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-651",
    "module": "stock-transfers",
    "method": "POST",
    "path": "/api/v1/stock-transfers/{id}/ship",
    "summary": "POST endpoint for stock-transfers ship",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-transfers (ship)",
    "controller": "StockTransferController",
    "action": "ship",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-652",
    "module": "stock-transfers",
    "method": "GET",
    "path": "/api/v1/stock-transfers/{stock_transfer}",
    "summary": "GET endpoint for stock-transfers show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-transfers (show)",
    "controller": "StockTransferController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-653",
    "module": "stock-transfers",
    "method": "PUT",
    "path": "/api/v1/stock-transfers/{stock_transfer}",
    "summary": "PUT endpoint for stock-transfers update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-transfers (update)",
    "controller": "StockTransferController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-654",
    "module": "stock-transfers",
    "method": "DELETE",
    "path": "/api/v1/stock-transfers/{stock_transfer}",
    "summary": "DELETE endpoint for stock-transfers destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stock-transfers (destroy)",
    "controller": "StockTransferController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-655",
    "module": "storage",
    "method": "GET",
    "path": "/api/v1/storage/{path}",
    "summary": "GET endpoint for storage Closure",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ storage (Closure)",
    "controller": "ApiController",
    "action": "Closure",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-656",
    "module": "store",
    "method": "POST",
    "path": "/api/v1/store/auth/change-password",
    "summary": "POST endpoint for store changePassword",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (changePassword)",
    "controller": "CustomerAuthController",
    "action": "changePassword",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-657",
    "module": "store",
    "method": "POST",
    "path": "/api/v1/store/auth/forgot-password",
    "summary": "POST endpoint for store forgotPassword",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (forgotPassword)",
    "controller": "CustomerAuthController",
    "action": "forgotPassword",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-658",
    "module": "store",
    "method": "POST",
    "path": "/api/v1/store/auth/login",
    "summary": "POST endpoint for store login",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (login)",
    "controller": "CustomerAuthController",
    "action": "login",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-659",
    "module": "store",
    "method": "POST",
    "path": "/api/v1/store/auth/logout",
    "summary": "POST endpoint for store logout",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (logout)",
    "controller": "CustomerAuthController",
    "action": "logout",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-660",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/auth/me",
    "summary": "GET endpoint for store me",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (me)",
    "controller": "CustomerAuthController",
    "action": "me",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-661",
    "module": "store",
    "method": "PUT",
    "path": "/api/v1/store/auth/profile",
    "summary": "PUT endpoint for store updateProfile",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (updateProfile)",
    "controller": "CustomerAuthController",
    "action": "updateProfile",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-662",
    "module": "store",
    "method": "POST",
    "path": "/api/v1/store/auth/register",
    "summary": "POST endpoint for store register",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (register)",
    "controller": "CustomerAuthController",
    "action": "register",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-663",
    "module": "store",
    "method": "POST",
    "path": "/api/v1/store/auth/reset-password",
    "summary": "POST endpoint for store resetPassword",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (resetPassword)",
    "controller": "CustomerAuthController",
    "action": "resetPassword",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-664",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/banners",
    "summary": "GET endpoint for store banners",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (banners)",
    "controller": "StorefrontController",
    "action": "banners",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-665",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/blog",
    "summary": "GET endpoint for store blog",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (blog)",
    "controller": "StorefrontController",
    "action": "blog",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-666",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/blog/{slug}",
    "summary": "GET endpoint for store blogDetail",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (blogDetail)",
    "controller": "StorefrontController",
    "action": "blogDetail",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-667",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/brands",
    "summary": "GET endpoint for store brands",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (brands)",
    "controller": "StorefrontController",
    "action": "brands",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-668",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/cart",
    "summary": "GET endpoint for store show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (show)",
    "controller": "CartController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-669",
    "module": "store",
    "method": "POST",
    "path": "/api/v1/store/cart/add",
    "summary": "POST endpoint for store add",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (add)",
    "controller": "CartController",
    "action": "add",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-670",
    "module": "store",
    "method": "POST",
    "path": "/api/v1/store/cart/apply-coupon",
    "summary": "POST endpoint for store applyCoupon",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (applyCoupon)",
    "controller": "CartController",
    "action": "applyCoupon",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-671",
    "module": "store",
    "method": "POST",
    "path": "/api/v1/store/cart/checkout",
    "summary": "POST endpoint for store checkout",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (checkout)",
    "controller": "CartController",
    "action": "checkout",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-672",
    "module": "store",
    "method": "DELETE",
    "path": "/api/v1/store/cart/clear",
    "summary": "DELETE endpoint for store clear",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (clear)",
    "controller": "CartController",
    "action": "clear",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-673",
    "module": "store",
    "method": "DELETE",
    "path": "/api/v1/store/cart/remove",
    "summary": "DELETE endpoint for store remove",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (remove)",
    "controller": "CartController",
    "action": "remove",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-674",
    "module": "store",
    "method": "PUT",
    "path": "/api/v1/store/cart/update",
    "summary": "PUT endpoint for store update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (update)",
    "controller": "CartController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-675",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/categories",
    "summary": "GET endpoint for store categories",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (categories)",
    "controller": "StorefrontController",
    "action": "categories",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-676",
    "module": "store",
    "method": "POST",
    "path": "/api/v1/store/coupons/validate",
    "summary": "POST endpoint for store validateCoupon",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (validateCoupon)",
    "controller": "StorefrontController",
    "action": "validateCoupon",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-677",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/faqs",
    "summary": "GET endpoint for store faqs",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (faqs)",
    "controller": "StorefrontController",
    "action": "faqs",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-678",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/featured",
    "summary": "GET endpoint for store featured",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (featured)",
    "controller": "StorefrontController",
    "action": "featured",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-679",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/flash-sale",
    "summary": "GET endpoint for store flashSale",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (flashSale)",
    "controller": "StorefrontController",
    "action": "flashSale",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-680",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/flash-sales",
    "summary": "GET endpoint for store flashSale",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (flashSale)",
    "controller": "StorefrontController",
    "action": "flashSale",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-681",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/homepage",
    "summary": "GET endpoint for store homepage",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (homepage)",
    "controller": "StorefrontController",
    "action": "homepage",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-682",
    "module": "store",
    "method": "POST",
    "path": "/api/v1/store/newsletter/subscribe",
    "summary": "POST endpoint for store newsletterSubscribe",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (newsletterSubscribe)",
    "controller": "StorefrontController",
    "action": "newsletterSubscribe",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-683",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/orders",
    "summary": "GET endpoint for store myOrders",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (myOrders)",
    "controller": "OrderController",
    "action": "myOrders",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-684",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/orders/{number}",
    "summary": "GET endpoint for store trackByNumber",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (trackByNumber)",
    "controller": "OrderController",
    "action": "trackByNumber",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-685",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/pages/{slug}",
    "summary": "GET endpoint for store pageDetail",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (pageDetail)",
    "controller": "StorefrontController",
    "action": "pageDetail",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-686",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/products",
    "summary": "GET endpoint for store products",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (products)",
    "controller": "StorefrontController",
    "action": "products",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-687",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/products/{slug}",
    "summary": "GET endpoint for store productDetail",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (productDetail)",
    "controller": "StorefrontController",
    "action": "productDetail",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-688",
    "module": "store",
    "method": "POST",
    "path": "/api/v1/store/reviews",
    "summary": "POST endpoint for store store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (store)",
    "controller": "ReviewController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-689",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/search",
    "summary": "GET endpoint for store search",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (search)",
    "controller": "StorefrontController",
    "action": "search",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-690",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/search/autocomplete",
    "summary": "GET endpoint for store autocomplete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (autocomplete)",
    "controller": "StorefrontController",
    "action": "autocomplete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-691",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/settings",
    "summary": "GET endpoint for store settings",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (settings)",
    "controller": "StorefrontController",
    "action": "settings",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-692",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/track/{number}",
    "summary": "GET endpoint for store trackByNumber",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (trackByNumber)",
    "controller": "OrderController",
    "action": "trackByNumber",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-693",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/trending-searches",
    "summary": "GET endpoint for store trendingSearches",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (trendingSearches)",
    "controller": "StorefrontController",
    "action": "trendingSearches",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-694",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/wishlist",
    "summary": "GET endpoint for store index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (index)",
    "controller": "WishlistController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-695",
    "module": "store",
    "method": "POST",
    "path": "/api/v1/store/wishlist/add",
    "summary": "POST endpoint for store add",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (add)",
    "controller": "WishlistController",
    "action": "add",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-696",
    "module": "store",
    "method": "GET",
    "path": "/api/v1/store/wishlist/check/{productId}",
    "summary": "GET endpoint for store check",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (check)",
    "controller": "WishlistController",
    "action": "check",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-697",
    "module": "store",
    "method": "POST",
    "path": "/api/v1/store/wishlist/move-all-to-cart",
    "summary": "POST endpoint for store moveAllToCart",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (moveAllToCart)",
    "controller": "WishlistController",
    "action": "moveAllToCart",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-698",
    "module": "store",
    "method": "DELETE",
    "path": "/api/v1/store/wishlist/product/{productId}",
    "summary": "DELETE endpoint for store removeByProduct",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (removeByProduct)",
    "controller": "WishlistController",
    "action": "removeByProduct",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-699",
    "module": "store",
    "method": "DELETE",
    "path": "/api/v1/store/wishlist/{id}",
    "summary": "DELETE endpoint for store remove",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (remove)",
    "controller": "WishlistController",
    "action": "remove",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-700",
    "module": "store",
    "method": "POST",
    "path": "/api/v1/store/wishlist/{id}/move-to-cart",
    "summary": "POST endpoint for store moveToCart",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ store (moveToCart)",
    "controller": "WishlistController",
    "action": "moveToCart",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-701",
    "module": "stores",
    "method": "GET",
    "path": "/api/v1/stores",
    "summary": "GET endpoint for stores index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stores (index)",
    "controller": "StoreController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-702",
    "module": "stores",
    "method": "POST",
    "path": "/api/v1/stores",
    "summary": "POST endpoint for stores store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stores (store)",
    "controller": "StoreController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-703",
    "module": "stores",
    "method": "DELETE",
    "path": "/api/v1/stores/{id}/force",
    "summary": "DELETE endpoint for stores forceDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stores (forceDelete)",
    "controller": "StoreController",
    "action": "forceDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-704",
    "module": "stores",
    "method": "POST",
    "path": "/api/v1/stores/{id}/restore",
    "summary": "POST endpoint for stores restore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stores (restore)",
    "controller": "StoreController",
    "action": "restore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-705",
    "module": "stores",
    "method": "GET",
    "path": "/api/v1/stores/{store}",
    "summary": "GET endpoint for stores show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stores (show)",
    "controller": "StoreController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-706",
    "module": "stores",
    "method": "PUT",
    "path": "/api/v1/stores/{store}",
    "summary": "PUT endpoint for stores update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stores (update)",
    "controller": "StoreController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-707",
    "module": "stores",
    "method": "DELETE",
    "path": "/api/v1/stores/{store}",
    "summary": "DELETE endpoint for stores destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ stores (destroy)",
    "controller": "StoreController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-708",
    "module": "suppliers",
    "method": "GET",
    "path": "/api/v1/suppliers",
    "summary": "GET endpoint for suppliers index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ suppliers (index)",
    "controller": "SupplierController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-709",
    "module": "suppliers",
    "method": "POST",
    "path": "/api/v1/suppliers",
    "summary": "POST endpoint for suppliers store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ suppliers (store)",
    "controller": "SupplierController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-710",
    "module": "suppliers",
    "method": "POST",
    "path": "/api/v1/suppliers/bulk-delete",
    "summary": "POST endpoint for suppliers bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ suppliers (bulkDelete)",
    "controller": "SupplierController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-711",
    "module": "suppliers",
    "method": "DELETE",
    "path": "/api/v1/suppliers/{id}/force",
    "summary": "DELETE endpoint for suppliers forceDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ suppliers (forceDelete)",
    "controller": "SupplierController",
    "action": "forceDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-712",
    "module": "suppliers",
    "method": "POST",
    "path": "/api/v1/suppliers/{id}/restore",
    "summary": "POST endpoint for suppliers restore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ suppliers (restore)",
    "controller": "SupplierController",
    "action": "restore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-713",
    "module": "suppliers",
    "method": "GET",
    "path": "/api/v1/suppliers/{supplier}",
    "summary": "GET endpoint for suppliers show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ suppliers (show)",
    "controller": "SupplierController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-714",
    "module": "suppliers",
    "method": "PUT",
    "path": "/api/v1/suppliers/{supplier}",
    "summary": "PUT endpoint for suppliers update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ suppliers (update)",
    "controller": "SupplierController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-715",
    "module": "suppliers",
    "method": "DELETE",
    "path": "/api/v1/suppliers/{supplier}",
    "summary": "DELETE endpoint for suppliers destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ suppliers (destroy)",
    "controller": "SupplierController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-716",
    "module": "taxes",
    "method": "GET",
    "path": "/api/v1/taxes",
    "summary": "GET endpoint for taxes index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ taxes (index)",
    "controller": "TaxController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-717",
    "module": "taxes",
    "method": "POST",
    "path": "/api/v1/taxes",
    "summary": "POST endpoint for taxes store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ taxes (store)",
    "controller": "TaxController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-718",
    "module": "taxes",
    "method": "POST",
    "path": "/api/v1/taxes/bulk-delete",
    "summary": "POST endpoint for taxes bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ taxes (bulkDelete)",
    "controller": "TaxController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-719",
    "module": "taxes",
    "method": "POST",
    "path": "/api/v1/taxes/bulk-restore",
    "summary": "POST endpoint for taxes bulkRestore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ taxes (bulkRestore)",
    "controller": "TaxController",
    "action": "bulkRestore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-720",
    "module": "taxes",
    "method": "GET",
    "path": "/api/v1/taxes/export",
    "summary": "GET endpoint for taxes export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ taxes (export)",
    "controller": "TaxController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-721",
    "module": "taxes",
    "method": "POST",
    "path": "/api/v1/taxes/import",
    "summary": "POST endpoint for taxes import",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ taxes (import)",
    "controller": "TaxController",
    "action": "import",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-722",
    "module": "taxes",
    "method": "DELETE",
    "path": "/api/v1/taxes/{id}/force",
    "summary": "DELETE endpoint for taxes forceDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ taxes (forceDelete)",
    "controller": "TaxController",
    "action": "forceDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-723",
    "module": "taxes",
    "method": "POST",
    "path": "/api/v1/taxes/{id}/restore",
    "summary": "POST endpoint for taxes restore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ taxes (restore)",
    "controller": "TaxController",
    "action": "restore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-724",
    "module": "taxes",
    "method": "GET",
    "path": "/api/v1/taxes/{tax}",
    "summary": "GET endpoint for taxes show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ taxes (show)",
    "controller": "TaxController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-725",
    "module": "taxes",
    "method": "PUT",
    "path": "/api/v1/taxes/{tax}",
    "summary": "PUT endpoint for taxes update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ taxes (update)",
    "controller": "TaxController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-726",
    "module": "taxes",
    "method": "DELETE",
    "path": "/api/v1/taxes/{tax}",
    "summary": "DELETE endpoint for taxes destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ taxes (destroy)",
    "controller": "TaxController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-727",
    "module": "transactions",
    "method": "GET",
    "path": "/api/v1/transactions",
    "summary": "GET endpoint for transactions index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ transactions (index)",
    "controller": "TransactionController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-728",
    "module": "transactions",
    "method": "POST",
    "path": "/api/v1/transactions",
    "summary": "POST endpoint for transactions store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ transactions (store)",
    "controller": "TransactionController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-729",
    "module": "transactions",
    "method": "GET",
    "path": "/api/v1/transactions/{transaction}",
    "summary": "GET endpoint for transactions show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ transactions (show)",
    "controller": "TransactionController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-730",
    "module": "transactions",
    "method": "PUT",
    "path": "/api/v1/transactions/{transaction}",
    "summary": "PUT endpoint for transactions update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ transactions (update)",
    "controller": "TransactionController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-731",
    "module": "transactions",
    "method": "DELETE",
    "path": "/api/v1/transactions/{transaction}",
    "summary": "DELETE endpoint for transactions destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ transactions (destroy)",
    "controller": "TransactionController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-732",
    "module": "units",
    "method": "GET",
    "path": "/api/v1/units",
    "summary": "GET endpoint for units index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ units (index)",
    "controller": "UnitController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-733",
    "module": "units",
    "method": "POST",
    "path": "/api/v1/units",
    "summary": "POST endpoint for units store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ units (store)",
    "controller": "UnitController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-734",
    "module": "units",
    "method": "POST",
    "path": "/api/v1/units/bulk-delete",
    "summary": "POST endpoint for units bulkDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ units (bulkDelete)",
    "controller": "UnitController",
    "action": "bulkDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-735",
    "module": "units",
    "method": "POST",
    "path": "/api/v1/units/bulk-restore",
    "summary": "POST endpoint for units bulkRestore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ units (bulkRestore)",
    "controller": "UnitController",
    "action": "bulkRestore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-736",
    "module": "units",
    "method": "GET",
    "path": "/api/v1/units/export",
    "summary": "GET endpoint for units export",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ units (export)",
    "controller": "UnitController",
    "action": "export",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-737",
    "module": "units",
    "method": "POST",
    "path": "/api/v1/units/import",
    "summary": "POST endpoint for units import",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ units (import)",
    "controller": "UnitController",
    "action": "import",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-738",
    "module": "units",
    "method": "DELETE",
    "path": "/api/v1/units/{id}/force",
    "summary": "DELETE endpoint for units forceDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ units (forceDelete)",
    "controller": "UnitController",
    "action": "forceDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-739",
    "module": "units",
    "method": "POST",
    "path": "/api/v1/units/{id}/restore",
    "summary": "POST endpoint for units restore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ units (restore)",
    "controller": "UnitController",
    "action": "restore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-740",
    "module": "units",
    "method": "GET",
    "path": "/api/v1/units/{unit}",
    "summary": "GET endpoint for units show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ units (show)",
    "controller": "UnitController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-741",
    "module": "units",
    "method": "PUT",
    "path": "/api/v1/units/{unit}",
    "summary": "PUT endpoint for units update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ units (update)",
    "controller": "UnitController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-742",
    "module": "units",
    "method": "DELETE",
    "path": "/api/v1/units/{unit}",
    "summary": "DELETE endpoint for units destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ units (destroy)",
    "controller": "UnitController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-743",
    "module": "users",
    "method": "GET",
    "path": "/api/v1/users",
    "summary": "GET endpoint for users index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ users (index)",
    "controller": "UserController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-744",
    "module": "users",
    "method": "POST",
    "path": "/api/v1/users",
    "summary": "POST endpoint for users store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ users (store)",
    "controller": "UserController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-745",
    "module": "users",
    "method": "GET",
    "path": "/api/v1/users/dashboard",
    "summary": "GET endpoint for users stats",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ users (stats)",
    "controller": "UserController",
    "action": "stats",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-746",
    "module": "users",
    "method": "GET",
    "path": "/api/v1/users/stats",
    "summary": "GET endpoint for users stats",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ users (stats)",
    "controller": "UserController",
    "action": "stats",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-747",
    "module": "users",
    "method": "POST",
    "path": "/api/v1/users/upload-avatar",
    "summary": "POST endpoint for users uploadAvatar",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ users (uploadAvatar)",
    "controller": "UserController",
    "action": "uploadAvatar",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-748",
    "module": "users",
    "method": "POST",
    "path": "/api/v1/users/{id}/assign-role",
    "summary": "POST endpoint for users assign",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ users (assign)",
    "controller": "UserRoleController",
    "action": "assign",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-749",
    "module": "users",
    "method": "POST",
    "path": "/api/v1/users/{id}/remove-role",
    "summary": "POST endpoint for users remove",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ users (remove)",
    "controller": "UserRoleController",
    "action": "remove",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-750",
    "module": "users",
    "method": "GET",
    "path": "/api/v1/users/{user}",
    "summary": "GET endpoint for users show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ users (show)",
    "controller": "UserController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-751",
    "module": "users",
    "method": "PUT",
    "path": "/api/v1/users/{user}",
    "summary": "PUT endpoint for users update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ users (update)",
    "controller": "UserController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-752",
    "module": "users",
    "method": "DELETE",
    "path": "/api/v1/users/{user}",
    "summary": "DELETE endpoint for users destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ users (destroy)",
    "controller": "UserController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-753",
    "module": "warehouses",
    "method": "GET",
    "path": "/api/v1/warehouses",
    "summary": "GET endpoint for warehouses index",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ warehouses (index)",
    "controller": "WarehouseController",
    "action": "index",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-754",
    "module": "warehouses",
    "method": "POST",
    "path": "/api/v1/warehouses",
    "summary": "POST endpoint for warehouses store",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ warehouses (store)",
    "controller": "WarehouseController",
    "action": "store",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-755",
    "module": "warehouses",
    "method": "DELETE",
    "path": "/api/v1/warehouses/{id}/force",
    "summary": "DELETE endpoint for warehouses forceDelete",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ warehouses (forceDelete)",
    "controller": "WarehouseController",
    "action": "forceDelete",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-756",
    "module": "warehouses",
    "method": "POST",
    "path": "/api/v1/warehouses/{id}/restore",
    "summary": "POST endpoint for warehouses restore",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ warehouses (restore)",
    "controller": "WarehouseController",
    "action": "restore",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-757",
    "module": "warehouses",
    "method": "GET",
    "path": "/api/v1/warehouses/{warehouse}",
    "summary": "GET endpoint for warehouses show",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ warehouses (show)",
    "controller": "WarehouseController",
    "action": "show",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-758",
    "module": "warehouses",
    "method": "PUT",
    "path": "/api/v1/warehouses/{warehouse}",
    "summary": "PUT endpoint for warehouses update",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ warehouses (update)",
    "controller": "WarehouseController",
    "action": "update",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  },
  {
    "id": "api-759",
    "module": "warehouses",
    "method": "DELETE",
    "path": "/api/v1/warehouses/{warehouse}",
    "summary": "DELETE endpoint for warehouses destroy",
    "summaryKh": "API endpoint សម្រាប់ប្រតិបត្តិការ warehouses (destroy)",
    "controller": "WarehouseController",
    "action": "destroy",
    "auth": false,
    "statusCodes": [
      {
        "code": 200,
        "description": "Success - Resource returned or processed"
      },
      {
        "code": 401,
        "description": "Unauthenticated - Invalid or expired JWT token"
      },
      {
        "code": 403,
        "description": "Forbidden - Insufficient Spatie permission"
      },
      {
        "code": 422,
        "description": "Validation Error - Missing or invalid payload attributes"
      },
      {
        "code": 500,
        "description": "Internal Server Error"
      }
    ],
    "responseSample": {
      "success": true,
      "message": "Operation completed successfully",
      "data": {}
    }
  }
];
