# Stream Bits

Stream Bits is a video streaming platform inspired by YouTube, built with a modern tech stack. This application features a user-friendly interface for video uploads, efficient transcoding services, and a scalable architecture using microservices and message queues.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)

## Features

- **User-Friendly Interface**: Intuitive design for easy navigation and video management.
- **Video Uploads**: Seamless uploading of videos with real-time progress tracking.
- **Efficient Transcoding**: Supports multiple video formats and resolutions.
- **Scalable Architecture**: Built with microservices and Kafka for handling large volumes of data.

## Technologies

- **Frontend**: [Next.js](https://nextjs.org/)
- **Backend**: [Node.js](https://nodejs.org/)
- **Transcoding Service**: [Node.js](https://nodejs.org/) with [Kafka](https://kafka.apache.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Message Queue**: [Kafka](https://kafka.apache.org/)

## Project Structure

```plaintext
stream-bits/
├── frontend/           # Frontend application
├── upload-service/     # Video upload service
└── transcode-service/  # Video transcoding service 
```

## Installation
To set up the project locally, follow these 

1.**Clone the repository**:

   ```bash
   git clone https://github.com/akashwarrior/stream-bits.git
   cd stream-bits
   ```


2.**Install dependencies**:

 For the frontend:

   ```bash
   cd frontend
   npm install
   ```
   
For the upload service:

```bash
cd upload-service
npm install
```

For the transcoding:

    cd transcode-service
    npm install
    
Set up environment variables: Create a .env file in each service directory. Ensure you configure your database and Kafka settings.

## Usage
Start the frontend:

```bash
cd frontend
npm run dev
```

Start the upload service:
```bash
cd upload-service
npm start
```

Start the transcoding service:

```bash
cd transcode-service
npm start
```

Ensure that Kafka and PostgreSQL are running and properly configured.

## Contributing
Contributions are welcome! If you'd like to contribute, please follow these steps:

Fork the repository.
Create a new branch (git checkout -b feature/YourFeature).
Make your changes and commit them (git commit -m 'Add some feature').
Push to the branch (git push origin feature/YourFeature).
Create a pull request.
