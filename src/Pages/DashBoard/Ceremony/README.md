# Ceremony API Integration

This document outlines the integration between the Ceremony component and the backend API.

## API Endpoints

The ceremony functionality uses the following backend endpoints:

### Create Ceremony

- **Endpoint**: `POST /events/create`
- **Purpose**: Create a new ceremony
- **Required Fields**: `title`, `description`, `ceremonyType`, `userId`

### Update Ceremony

- **Endpoint**: `PATCH /events/update/:id`
- **Purpose**: Update an existing ceremony
- **Parameter**: `id` - The ceremony ID to update

### Delete Ceremony

- **Endpoint**: `DELETE /events/delete/:id`
- **Purpose**: Delete a ceremony
- **Parameter**: `id` - The ceremony ID to delete

## Data Structure

### Backend Schema (EventSchema)

```javascript
{
  title: { type: String, required: true },
  description: { type: String, required: true },
  ceremonyType: { type: String, required: true },
  vowsType: { type: String, required: false },
  language: { type: String, required: false },
  vowDescription: { type: String, required: false },
  rituals: { type: String, required: false },
  musicCues: { type: String, required: false },
  ritualsDescription: { type: String, required: false },
  eventDate: { type: Date, required: false },
  eventTime: { type: Date, required: false },
  location: { type: String, required: false },
  rehearsalDate: { type: Date, required: false },
  userId: { type: String, required: true },
  officiantId: { type: String, required: false },
  officiantName: { type: String, required: false },
  status: {
    type: String,
    enum: ["planned", "submitted", "approved", "completed", "canceled"],
    default: "planned"
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### Frontend Types

```typescript
export interface CeremonyFormData {
  title: string;
  description: string;
  ceremonyType: string;
  vowsType?: string;
  language?: string;
  vowDescription?: string;
  rituals?: string;
  musicCues?: string;
  ritualsDescription?: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  rehearsalDate?: string;
  officiantId?: string;
  officiantName?: string;
}

export interface CeremonyData extends CeremonyFormData {
  _id?: string;
  id?: string;
  userId: string;
  status: "planned" | "submitted" | "approved" | "completed" | "canceled";
  createdAt: Date | string;
  updatedAt: Date | string;
}
```

## Components Updated

### 1. Main Ceremony Component (`Ceremony.tsx`)

- **API Integration**: Full CRUD operations
- **Authentication**: Uses `useAuth()` to get current user
- **Loading States**: Shows loading indicators during API calls
- **Error Handling**: Uses GlassSwal for user-friendly error messages

### 2. API Service (`ceremonyApi.ts`)

- **CeremonyApiService Class**: Encapsulates all API operations
- **Error Handling**: Consistent error handling across all methods
- **Response Mapping**: Maps backend `_id` to frontend `id` for compatibility

### 3. Component Updates

- **TypeStep**: Updated to use `ceremonyType` field
- **VowsStep**: Added `vowDescription` field and register prop
- **RitualsStep**: Updated to use `musicCues` and `ritualsDescription`
- **ScheduleStep**: Updated to use `eventDate`, `eventTime`, and `rehearsalDate`
- **NavigationButtons**: Added loading states and async support
- **DraftTab**: Updated field mappings and added loading states
- **MyCeremonyTab**: Updated field mappings and added loading states

## Usage Flow

### Creating a Ceremony

1. User fills out the ceremony form across 5 steps
2. On "Send To Officiant", form data is submitted with status "completed"
3. API creates ceremony in backend with user authentication
4. Success feedback shown to user
5. User redirected to "My Ceremonies" tab

### Saving a Draft

1. User can save progress at any step (except step 1)
2. Form data is submitted with status "planned"
3. Draft is saved and user redirected to "Draft" tab

### Managing Ceremonies

- **Drafts**: Listed in Draft tab, can be continued or deleted
- **Completed**: Listed in My Ceremonies tab, can be viewed or deleted
- **Loading States**: All operations show appropriate loading indicators

## Authentication

- Uses JWT tokens via `AxiosProvider`
- Automatic token refresh on expiry
- User context from `AuthProvider`

## Error Handling

- Network errors are caught and displayed to user
- Validation errors from backend are shown
- Loading states prevent multiple simultaneous requests

## File Structure

```
src/Pages/DashBoard/Ceremony/
├── Ceremony.tsx                 # Main component
├── services/
│   └── ceremonyApi.ts          # API service class
├── hooks/
│   └── useCeremonyApi.ts       # Custom hook for API service
├── types/
│   └── index.ts                # TypeScript interfaces
└── components/
    ├── TypeStep.tsx            # Step 1: Ceremony type & description
    ├── VowsStep.tsx           # Step 2: Vows preferences
    ├── RitualsStep.tsx        # Step 3: Rituals & music
    ├── ScheduleStep.tsx       # Step 4: Date, time, location
    ├── ReviewStep.tsx         # Step 5: Review all details
    ├── NavigationButtons.tsx  # Step navigation
    ├── DraftTab.tsx          # Draft ceremonies management
    └── MyCeremonyTab.tsx     # Completed ceremonies management
```

## Environment Variables

Make sure your environment has the correct API base URL:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Dependencies Added

- Uses existing axios configuration from `AxiosProvider`
- Uses existing authentication from `AuthProvider`
- Uses existing toast notifications from `GlassSwal`
- No additional dependencies required
