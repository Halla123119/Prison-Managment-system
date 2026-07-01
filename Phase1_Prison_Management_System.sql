CREATE DATABASE PrisonManagementSystem;
GO

USE PrisonManagementSystem;
GO


-- TABLE: Cells

CREATE TABLE Cells (
    CellId INT PRIMARY KEY IDENTITY(1,1),
    CellNumber VARCHAR(20) NOT NULL,
    Capacity INT NOT NULL,
    Status VARCHAR(20) NOT NULL
);


-- TABLE: Prisoners

CREATE TABLE Prisoners (
    PrisonerId INT PRIMARY KEY IDENTITY(1,1),
    FullName VARCHAR(100) NOT NULL,
    Gender VARCHAR(10),
    Age INT,
    Crime VARCHAR(100),
    SentenceYears INT,
    CellId INT,
    FOREIGN KEY (CellId) REFERENCES Cells(CellId)
);

-- TABLE: Staff

CREATE TABLE Staff (
    StaffId INT PRIMARY KEY IDENTITY(1,1),
    FullName VARCHAR(100) NOT NULL,
    Position VARCHAR(50),
    Phone VARCHAR(20)
);


-- TABLE: Users

CREATE TABLE Users (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    Username VARCHAR(50) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Role VARCHAR(20) NOT NULL
);


-- INSERT: Cells

INSERT INTO Cells (CellNumber, Capacity, Status)
VALUES 
('A-101', 4, 'Available'),
('A-102', 2, 'Occupied'),
('B-201', 3, 'Available');


-- INSERT: Prisoners

INSERT INTO Prisoners (FullName, Gender, Age, Crime, SentenceYears, CellId)
VALUES 
('Ahmed Ali', 'Male', 30, 'Mobile Theft', 5, 1),
('Hassan Mohamed', 'Male', 40, 'Fraud', 10, 2),
('Asha Noor', 'Female', 28, 'Assault', 3, 3);


-- INSERT: Staff (Somali Positions)

INSERT INTO Staff (FullName, Position, Phone)
VALUES 
('Abdi Hassan', 'Taliyaha Xabsiga', '617000111'),
('Sahra Ali', 'Ilaaliye', '618000222');


-- INSERT: Users

INSERT INTO Users (Username, Password, Role)
VALUES 
('admin', 'admin123', 'Admin'),
('staff1', 'staff123', 'Staff');


-- SELECT ALL

SELECT * FROM Cells;
SELECT * FROM Prisoners;
SELECT * FROM Staff;
SELECT * FROM Users;

