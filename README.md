## YouApp Coding Challenge

The YouApp API is a backend service that supports user authentication, profile management, messaging, friendships, and horoscope-related features. It provides endpoints for user registration, login, token refresh, and logout using JWT for secure access.

Users can manage their profiles by updating personal information like name, gender, birthday, zodiac, and interests. The messaging feature allows users to send, retrieve, edit, and delete messages with pagination support. The friendships module includes functionality for sending requests, managing statuses, and retrieving friend lists.

Additionally, the API offers endpoints for accessing zodiac and horoscope information, including daily horoscopes and zodiac details. The system ensures secure access through token authentication and is designed to be modular and scalable for various applications.

### 🛠️ Tech Stack

**Backend**: NestJS, MongoDB, RabbitMQ, Socket.io, Docker.

**Frontend**: NextJS.

### ⚙️ Installation and Setup

1. Clone the Repository

    ```bash
    git clone https://github.com/abela-a/you-app-challenge.git

    cd you-app-challenge
    ```

2. Run docker-compose

    ```bash
    docker-compose up --build
    ```

3. Access the Application

    - **Frontend** (Next.js): http://localhost:3000
    - **Backend** (Nest.js): http://localhost:4000
    - **Socket.io** (Nest.js): http://localhost:4001
    - **MongoDB**: http://localhost:27017
    - **RabbitMQ** Dashboard: http://localhost:15672

        Username: `guest`, Password: `guest`

### 📝 Documentation

-   **REST API** (Swagger): http://localhost:4000/api
-   **Gateway** (Socket.io): [http://localhost:4001](https://github.com/abela-a/you-app-challenge/blob/main/backend/docs/socketio.md)

### 📧 Contact

I would greatly appreciate any feedback on my work, as it will help me improve and grow as a developer. If you have any comments, suggestions, or questions regarding this project, please feel free to reach out:

-   **Name:** Abel A Simanungkalit
-   **Email:** [abelardhana96@gmail.com](mailto:abelardhana96@gmail.com)
-   **GitHub Profile:** [https://github.com/abela-a](https://github.com/abela-a)

Thank you for taking the time to review this project!
