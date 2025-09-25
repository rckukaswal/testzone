class NotesViewer {
    constructor() {
        this.notes = {
            'basic-notes': `Java Basics
============

1. Introduction to Java
   - Platform independent (Write Once, Run Anywhere)
   - Object-oriented programming language
   - Robust and secure
   - Simple and easy to learn

2. Basic Syntax
   - Classes and Objects
   - Methods and Variables
   - Data Types (primitive and reference)
   - Operators and Expressions

3. Control Structures
   - If-else statements
   - Switch statements
   - Loops (for, while, do-while)
   - Break and continue statements

4. Example Code:
   \`\`\`java
   public class HelloWorld {
       public static void main(String[] args) {
           System.out.println("Hello, World!");
       }
   }
   \`\`\``,

            'oops-notes': `Object-Oriented Programming in Java
=================================

1. Four Pillars of OOP:
   - Encapsulation: Binding data and methods together
   - Inheritance: Creating new classes from existing ones
   - Polymorphism: One interface, multiple implementations
   - Abstraction: Hiding implementation details

2. Classes and Objects
   - Class: Blueprint for objects
   - Object: Instance of a class

3. Important Concepts:
   - Constructors
   - Method Overloading
   - Method Overriding
   - Interfaces and Abstract Classes
   - Packages

4. Example:
   \`\`\`java
   public class Animal {
       public void sound() {
           System.out.println("Animal makes sound");
       }
   }
   
   public class Dog extends Animal {
       @Override
       public void sound() {
           System.out.println("Dog barks");
       }
   }
   \`\`\``,

            'collections-notes': `Java Collections Framework
===========================

1. Core Interfaces:
   - List: Ordered collection, allows duplicates
   - Set: No duplicates, unordered
   - Map: Key-value pairs
   - Queue: FIFO ordering

2. Common Implementations:
   - ArrayList: Resizable array implementation
   - LinkedList: Doubly-linked list
   - HashSet: Hash table implementation
   - HashMap: Key-value storage
   - TreeMap: Sorted key-value pairs

3. Example:
   \`\`\`java
   import java.util.*;
   
   public class CollectionExample {
       public static void main(String[] args) {
           List<String> names = new ArrayList<>();
           names.add("Alice");
           names.add("Bob");
           
           Map<String, Integer> ages = new HashMap<>();
           ages.put("Alice", 25);
           ages.put("Bob", 30);
       }
   }
   \`\`\``,

            'multithreading-notes': `Multithreading in Java
=======================

1. Thread Creation:
   - Extending Thread class
   - Implementing Runnable interface

2. Thread States:
   - New, Runnable, Blocked, Waiting, Timed Waiting, Terminated

3. Synchronization:
   - synchronized keyword
   - volatile keyword
   - Lock interface

4. Example:
   \`\`\`java
   public class MyThread extends Thread {
       public void run() {
           for (int i = 0; i < 5; i++) {
               System.out.println(Thread.currentThread().getName() + ": " + i);
           }
       }
   }
   \`\`\``,

            'jdbc-notes': `JDBC (Java Database Connectivity)
==============================

1. JDBC Components:
   - DriverManager
   - Connection
   - Statement
   - ResultSet

2. Basic Steps:
   - Load the driver
   - Establish connection
   - Create statement
   - Execute query
   - Process results
   - Close connection

3. Example:
   \`\`\`java
   import java.sql.*;
   
   public class JdbcExample {
       public static void main(String[] args) {
           try {
               Connection conn = DriverManager.getConnection(url, user, password);
               Statement stmt = conn.createStatement();
               ResultSet rs = stmt.executeQuery("SELECT * FROM users");
               
               while (rs.next()) {
                   System.out.println(rs.getString("name"));
               }
           } catch (SQLException e) {
               e.printStackTrace();
           }
       }
   }
   \`\`\``,

            'exception-notes': `Exception Handling in Java
==========================

1. Types of Exceptions:
   - Checked Exceptions (compile-time)
   - Unchecked Exceptions (runtime)
   - Errors

2. Exception Handling Keywords:
   - try, catch, finally
   - throw, throws

3. Best Practices:
   - Use specific exceptions
   - Don't ignore exceptions
   - Close resources in finally block

4. Example:
   \`\`\`java
   public class ExceptionExample {
       public void readFile() {
           try {
               File file = new File("nonexistent.txt");
               FileReader fr = new FileReader(file);
           } catch (FileNotFoundException e) {
               System.out.println("File not found: " + e.getMessage());
           } finally {
               System.out.println("This block always executes");
           }
       }
   }
   \`\`\``,

            'io-notes': `I/O Operations in Java
=====================

1. Stream Types:
   - Byte Streams (InputStream, OutputStream)
   - Character Streams (Reader, Writer)

2. File Operations:
   - File class
   - FileReader/FileWriter
   - BufferedReader/BufferedWriter

3. Example:
   \`\`\`java
   import java.io.*;
   
   public class FileExample {
       public void readFile() throws IOException {
           BufferedReader reader = new BufferedReader(new FileReader("file.txt"));
           String line;
           while ((line = reader.readLine()) != null) {
               System.out.println(line);
           }
           reader.close();
       }
   }
   \`\`\``,

            'design-patterns': `Design Patterns in Java
=======================

1. Creational Patterns:
   - Singleton: Ensure single instance
   - Factory: Object creation without specifying exact class
   - Builder: Complex object construction

2. Structural Patterns:
   - Adapter: Interface compatibility
   - Decorator: Add functionality dynamically
   - Facade: Simplified interface

3. Behavioral Patterns:
   - Observer: Publish-subscribe mechanism
   - Strategy: Algorithm selection at runtime
   - Template Method: Algorithm skeleton

4. Singleton Example:
   \`\`\`java
   public class Singleton {
       private static Singleton instance;
       
       private Singleton() {}
       
       public static Singleton getInstance() {
           if (instance == null) {
               instance = new Singleton();
           }
           return instance;
       }
   }
   \`\`\``
        };
        
        this.currentNote = null;
        this.init();
    }

    init() {
        // Load first note by default
        this.loadNote('basic-notes');
    }

    loadNote(noteId) {
        this.currentNote = noteId;
        const noteContent = this.notes[noteId] || 'Notes not available.';
        
        document.getElementById('noteTitle').textContent = this.getNoteTitle(noteId);
        document.getElementById('notesDisplay').innerHTML = this.formatNoteContent(noteContent);
        
        // Update active state in sidebar
        this.updateActiveLink(noteId);
    }

    getNoteTitle(noteId) {
        const titles = {
            'basic-notes': 'Java Basics',
            'oops-notes': 'Object-Oriented Programming',
            'collections-notes': 'Collections Framework',
            'multithreading-notes': 'Multithreading',
            'jdbc-notes': 'JDBC Database Connectivity',
            'exception-notes': 'Exception Handling',
            'io-notes': 'I/O Operations',
            'design-patterns': 'Design Patterns'
        };
        
        return titles[noteId] || 'Java Notes';
    }

    formatNoteContent(content) {
        // Convert markdown-like syntax to HTML
        let html = content
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/```java\n([\s\S]*?)```/g, '<pre class="code-block"><code class="language-java">$1</code></pre>')
            .replace(/\n/g, '<br>');
        
        // Numbered lists
        html = html.replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
        
        return html;
    }

    updateActiveLink(noteId) {
        const links = document.querySelectorAll('#notesList a');
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('onclick').includes(noteId)) {
                link.classList.add('active');
            }
        });
    }

    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const button = document.querySelector('button[onclick="toggleDarkMode()"]');
        if (document.body.classList.contains('dark-mode')) {
            button.textContent = '☀️ Light Mode';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            button.textContent = '🌙 Dark Mode';
            localStorage.setItem('darkMode', 'disabled');
        }
    }

    printNotes() {
        const content = document.getElementById('notesDisplay').innerHTML;
        const title = document.getElementById('noteTitle').textContent;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
                        h1 { color: #2c3e50; border-bottom: 2px solid #3498db; }
                        .code-block { background: #f8f9fa; padding: 15px; border-left: 4px solid #3498db; }
                    </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    ${content}
                </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
    }

    searchNotes(query) {
        // Simple search functionality
        const results = [];
        
        Object.keys(this.notes).forEach(noteId => {
            const content = this.notes[noteId].toLowerCase();
            if (content.includes(query.toLowerCase())) {
                results.push(noteId);
            }
        });
        
        return results;
    }
}

// Initialize notes viewer
const notesViewer = new NotesViewer();

// Global functions for HTML onclick attributes
function loadNote(noteId) {
    notesViewer.loadNote(noteId);
}

function toggleDarkMode() {
    notesViewer.toggleDarkMode();
}

function printNotes() {
    notesViewer.printNotes();
}

// Load dark mode preference
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        const button = document.querySelector('button[onclick="toggleDarkMode()"]');
        if (button) button.textContent = '☀️ Light Mode';
    }
});
