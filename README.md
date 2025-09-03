# File Uploader App

A simple file and folder management system built with Express.js, Prisma, Passport.js, Multer, and Cloudinary.
Users can register, log in, upload files into folders, download them, and share folders with others via unique share links.

# Features

- **Authentication** with Passport.js (session-based).
- **CRUD Folders** – create, edit, and delete folders.
- **Upload Files** into folders using Multer.
- Cloud Storage integration **(Cloudinary)**.
- Download Files with proper file headers.
- **View File Details** – name, size, and upload time.
- **Share Folders** – generate expiring links (e.g. valid for 1d, 10d).
- Styled with **TailwindCSS** + **EJS templates**.

# Tech Stack

- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL + Prisma ORM.
- **Auth**: Passport.js + Prisma Session Store.
- **File Uploads**: Multer + Cloudinary.
- Views: **EJS** + **TailwindCSS**.

# How It Works

- Register/Login using **Passport.js** sessions.
- Create folders and upload files into them.
- Files are uploaded to **Cloudinary** and the URL is saved in **PostgreSQL**.
- Users can view file details and download files.
- Folders can be shared with a public expiring link.


# Extra Credit Features

- Share links auto-expire after a given duration.
- Download button forces download instead of opening file in browser.