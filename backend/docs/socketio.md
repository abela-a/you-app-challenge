# **Socket.IO WebSocket API Documentation**

## **Overview**

This documentation provides details on WebSocket events for real-time communication using **Socket.IO**.

### **General Configuration**

- **WebSocket Port:**
  Default: `4001`, or as configured in the `SOCKET_PORT` environment variable.
- **Namespace:**
  The default namespace (`/`) is used.
- **CORS Policy:**
  Allows all origins (`*`). Ensure this configuration is restricted to trusted origins in production.

---

## **Event List**

The API supports two types of events:

1. **Listen Events**: Server-to-client events.
2. **Emit Events**: Client-to-server events.

### **1. Listen Events**

| **Event Name**        | **Description**                                            | **Payload**                                                                                                |
| --------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **error**             | Sends an error message to the client.                      | `{ "code": "string", "message": "string" }`                                                                |
| **typing.start**      | Notifies clients when a user starts typing.                | `{ "sender": "string" }`                                                                                   |
| **typing.stop**       | Notifies clients when a user stops typing.                 | `{ "sender": "string" }`                                                                                   |
| **message.new**       | Sends a new message to the recipient.                      | `{ "id": "string", "sender": "string", "receiver": "string", "content": "string", "timestamp": "string" }` |
| **message.readed**    | Indicates that a specific message was read.                | `{ "messageId": "string", "reader": "string" }`                                                            |
| **message.readedAll** | Notifies that all messages for a user were marked as read. | _(No payload)_                                                                                             |
| **message.edited**    | Notifies that a message was edited.                        | `{ "messageId": "string", "content": "string" }`                                                           |
| **message.deleted**   | Notifies that a message was deleted.                       | `{ "messageId": "string" }`                                                                                |
| **notification**      | Sends a notification to the client.                        | `{ "title": "string", "message": "string", "data": "object" }`                                             |

---

### **2. Emit Events**

| **Event Name**          | **Description**                                      | **Payload**                                                         |
| ----------------------- | ---------------------------------------------------- | ------------------------------------------------------------------- |
| **chat:typingStart**    | Notifies the server that a user starts typing.       | `{ "sender": "string", "receiver": "string" }`                      |
| **chat:typingStop**     | Notifies the server that a user stops typing.        | `{ "sender": "string", "receiver": "string" }`                      |
| **chat:sendMessage**    | Sends a new message to the server for delivery.      | `{ "sender": "string", "receiver": "string", "content": "string" }` |
| **chat:messageRead**    | Marks a specific message as read.                    | `{ "messageId": "string", "receiver": "string" }`                   |
| **chat:messageReadAll** | Marks all messages for a specific recipient as read. | `{ "receiver": "string" }`                                          |
| **chat:editMessage**    | Edits the content of a previously sent message.      | `{ "messageId": "string", "content": "string" }`                    |
| **chat:deleteMessage**  | Deletes a specific message.                          | `{ "messageId": "string" }`                                         |
