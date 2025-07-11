const { getAllUsernames, searchUsernames, insertUsername, deleteAllUsernames } = require('../db/queries');

//Ici, on fait des fonctions avec les queries au db pour render une page.
//Here, getUsernames is a controller (have the logic and receives req and res objects)

const getUsernames = async (req, res) => {
    try {
        const searchTerm = req.query.search;
        let usernames; 
        
        if (searchTerm) {
            usernames = await searchUsernames(searchTerm); //when we return the rows, it's now usernames
            console.log(`Search results for "${searchTerm}":`, usernames);
        } else {
            usernames = await getAllUsernames();
            console.log("All usernames:", usernames);
        }
        
        const usernameList = usernames.map(user => user.username).join(', '); 
//   what usernames contain: usernames = [
//   { id: 1, username: 'alice' },
//   { id: 2, username: 'bob' },
//   { id: 3, username: 'charlie' }]
// Result: ['alice', 'bob', 'charlie']
// After .join(', '): 'alice, bob, charlie'

        const message = searchTerm 
            ? `Search results for "${searchTerm}": ${usernameList || 'No results found'}`
            : `All usernames: ${usernameList || 'No usernames found'}`;
            //We did not search anything: get all usernames and if there's nothing: "No usernames found"
            //We did search something: get the list and if there's nothing: No results found
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Username Manager</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                        padding: 20px;
                    }
                    
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        background: white;
                        border-radius: 20px;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                        overflow: hidden;
                    }
                    
                    .header {
                        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                        color: white;
                        padding: 30px;
                        text-align: center;
                    }
                    
                    .header h1 {
                        font-size: 2.5rem;
                        margin-bottom: 10px;
                        font-weight: 300;
                    }
                    
                    .header p {
                        opacity: 0.9;
                        font-size: 1.1rem;
                    }
                    
                    .content {
                        padding: 40px;
                    }
                    
                    .usernames-display {
                        background: #f8f9fa;
                        border-radius: 15px;
                        padding: 30px;
                        margin-bottom: 30px;
                        border-left: 5px solid #4CAF50;
                    }
                    
                    .usernames-display h2 {
                        color: #333;
                        margin-bottom: 15px;
                        font-size: 1.3rem;
                    }
                    
                    .usernames-list {
                        font-size: 1.1rem;
                        color: #555;
                        line-height: 1.6;
                    }
                    
                    .search-section {
                        background: white;
                        border-radius: 15px;
                        padding: 25px;
                        margin-bottom: 30px;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
                        border: 1px solid #e9ecef;
                    }
                    
                    .search-form {
                        display: flex;
                        gap: 15px;
                        align-items: center;
                        flex-wrap: wrap;
                    }
                    
                    .search-input {
                        flex: 1;
                        min-width: 200px;
                        padding: 12px 20px;
                        border: 2px solid #e9ecef;
                        border-radius: 25px;
                        font-size: 16px;
                        transition: all 0.3s ease;
                    }
                    
                    .search-input:focus {
                        outline: none;
                        border-color: #4CAF50;
                        box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
                    }
                    
                    .btn {
                        padding: 12px 25px;
                        border: none;
                        border-radius: 25px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        text-decoration: none;
                        display: inline-block;
                        text-align: center;
                        min-width: 100px;
                    }
                    
                    .btn-primary {
                        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                        color: white;
                    }
                    
                    .btn-primary:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
                    }
                    
                    .btn-secondary {
                        background: #6c757d;
                        color: white;
                    }
                    
                    .btn-secondary:hover {
                        background: #5a6268;
                        transform: translateY(-2px);
                    }
                    
                    .btn-danger {
                        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
                        color: white;
                    }
                    
                    .btn-danger:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
                    }
                    
                    .actions {
                        display: flex;
                        gap: 15px;
                        justify-content: center;
                        flex-wrap: wrap;
                    }
                    
                    .no-results {
                        text-align: center;
                        color: #6c757d;
                        font-style: italic;
                        padding: 20px;
                    }
                    
                    @media (max-width: 768px) {
                        .container {
                            margin: 10px;
                            border-radius: 15px;
                        }
                        
                        .header {
                            padding: 20px;
                        }
                        
                        .header h1 {
                            font-size: 2rem;
                        }
                        
                        .content {
                            padding: 20px;
                        }
                        
                        .search-form {
                            flex-direction: column;
                        }
                        
                        .search-input {
                            min-width: 100%;
                        }
                        
                        .actions {
                            flex-direction: column;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎯 Username Manager</h1>
                        <p>Manage your usernames with style</p>
                    </div>
                    
                    <div class="content">
                        <div class="usernames-display">
                            <h2>${searchTerm ? `🔍 Search Results for "${searchTerm}"` : '👥 All Usernames'}</h2>
                            <div class="usernames-list">
                                ${usernameList || '<div class="no-results">No usernames found</div>'}
                            </div>
                        </div>
                        
                        <div class="search-section">
                            <form method="GET" action="/" class="search-form">
                                <input 
                                    type="text" 
                                    name="search" 
                                    placeholder="🔍 Search usernames..." 
                                    value="${searchTerm || ''}"
                                    class="search-input"
                                />
                                <button type="submit" class="btn btn-primary">Search</button>
                                <a href="/" class="btn btn-secondary">Clear</a>
                            </form>
                        </div>
                        
                        <div class="actions">
                            <a href="/new" class="btn btn-primary">➕ Add New Username</a>
                            <a href="/delete" class="btn btn-danger">🗑️ Delete All Usernames</a>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error fetching usernames:', error);
        res.status(500).send('Error fetching usernames');
    }
};

const showUsernameForm = (req, res) => {
    const htmlForm = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Add Username - Username Manager</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .container {
                max-width: 500px;
                width: 100%;
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            
            .header {
                background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            
            .header h1 {
                font-size: 2.2rem;
                margin-bottom: 10px;
                font-weight: 300;
            }
            
            .header p {
                opacity: 0.9;
                font-size: 1rem;
            }
            
            .form-content {
                padding: 40px;
            }
            
            .form-group {
                margin-bottom: 25px;
            }
            
            label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #333;
                font-size: 1.1rem;
            }
            
            .input-wrapper {
                position: relative;
            }
            
            input[type="text"] {
                width: 100%;
                padding: 15px 20px;
                border: 2px solid #e9ecef;
                border-radius: 25px;
                font-size: 16px;
                transition: all 0.3s ease;
                background: #f8f9fa;
            }
            
            input[type="text"]:focus {
                outline: none;
                border-color: #4CAF50;
                box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
                background: white;
            }
            
            .btn {
                width: 100%;
                padding: 15px 25px;
                border: none;
                border-radius: 25px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                display: inline-block;
                text-align: center;
                margin-bottom: 15px;
            }
            
            .btn-primary {
                background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                color: white;
            }
            
            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
            }
            
            .navigation {
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #e9ecef;
            }
            
            .nav-links {
                display: flex;
                gap: 20px;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .nav-link {
                color: #6c757d;
                text-decoration: none;
                font-weight: 500;
                padding: 8px 16px;
                border-radius: 20px;
                transition: all 0.3s ease;
            }
            
            .nav-link:hover {
                background: #f8f9fa;
                color: #4CAF50;
            }
            
            .emoji {
                font-size: 1.2em;
                margin-right: 5px;
            }
            
            @media (max-width: 768px) {
                .container {
                    margin: 10px;
                    border-radius: 15px;
                }
                
                .header {
                    padding: 20px;
                }
                
                .header h1 {
                    font-size: 1.8rem;
                }
                
                .form-content {
                    padding: 20px;
                }
                
                .nav-links {
                    flex-direction: column;
                    gap: 10px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✨ Add New Username</h1>
                <p>Create a new username entry</p>
            </div>
            
            <div class="form-content">
                <form method="POST" action="/new">
                    <div class="form-group">
                        <label for="username">
                            <span class="emoji">👤</span>Username
                        </label>
                        <div class="input-wrapper">
                            <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                placeholder="Enter a username..." 
                                required 
                                autocomplete="off"
                            >
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">
                        <span class="emoji">💾</span>Save Username
                    </button>
                </form>
                
                <div class="navigation">
                    <div class="nav-links">
                        <a href="/" class="nav-link">
                            <span class="emoji">👥</span>View All Usernames
                        </a>
                        <a href="/delete" class="nav-link">
                            <span class="emoji">🗑️</span>Delete All
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
    res.send(htmlForm);
};

const saveUsername = async (req, res) => {
    try {
        const username = req.body.username;
        await insertUsername(username);
        console.log("username saved to database: ", username);
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Success - Username Manager</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                        padding: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    
                    .container {
                        max-width: 500px;
                        width: 100%;
                        background: white;
                        border-radius: 20px;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                        overflow: hidden;
                        text-align: center;
                    }
                    
                    .header {
                        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                        color: white;
                        padding: 40px 30px;
                    }
                    
                    .success-icon {
                        font-size: 4rem;
                        margin-bottom: 15px;
                        display: block;
                        animation: bounce 1s ease-in-out;
                    }
                    
                    @keyframes bounce {
                        0%, 20%, 60%, 100% { transform: translateY(0); }
                        40% { transform: translateY(-20px); }
                        80% { transform: translateY(-10px); }
                    }
                    
                    .header h1 {
                        font-size: 2.2rem;
                        margin-bottom: 10px;
                        font-weight: 300;
                    }
                    
                    .content {
                        padding: 40px 30px;
                    }
                    
                    .message {
                        font-size: 1.2rem;
                        color: #333;
                        margin-bottom: 30px;
                        line-height: 1.6;
                    }
                    
                    .username-display {
                        background: #f8f9fa;
                        padding: 15px 20px;
                        border-radius: 25px;
                        margin: 20px 0;
                        font-weight: 600;
                        color: #28a745;
                        font-size: 1.1rem;
                    }
                    
                    .actions {
                        display: flex;
                        gap: 15px;
                        justify-content: center;
                        flex-wrap: wrap;
                    }
                    
                    .btn {
                        padding: 12px 25px;
                        border-radius: 25px;
                        font-size: 16px;
                        font-weight: 600;
                        text-decoration: none;
                        transition: all 0.3s ease;
                        min-width: 120px;
                        display: inline-block;
                    }
                    
                    .btn-primary {
                        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                        color: white;
                    }
                    
                    .btn-primary:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
                    }
                    
                    .btn-secondary {
                        background: #6c757d;
                        color: white;
                    }
                    
                    .btn-secondary:hover {
                        background: #5a6268;
                        transform: translateY(-2px);
                    }
                    
                    @media (max-width: 768px) {
                        .container {
                            margin: 10px;
                            border-radius: 15px;
                        }
                        
                        .header {
                            padding: 30px 20px;
                        }
                        
                        .content {
                            padding: 30px 20px;
                        }
                        
                        .actions {
                            flex-direction: column;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <span class="success-icon">✅</span>
                        <h1>Success!</h1>
                    </div>
                    
                    <div class="content">
                        <div class="message">
                            Username has been successfully saved to the database!
                        </div>
                        
                        <div class="username-display">
                            👤 "${username}"
                        </div>
                        
                        <div class="actions">
                            <a href="/new" class="btn btn-primary">➕ Add Another</a>
                            <a href="/" class="btn btn-secondary">👥 View All</a>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error saving username:', error);
        res.status(500).send('Error saving username to database');
    }
};

const deleteAllUsernamesController = async (req, res) => {
    try {
        await deleteAllUsernames();
        console.log("All usernames deleted from database");
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Deleted - Username Manager</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                        padding: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    
                    .container {
                        max-width: 500px;
                        width: 100%;
                        background: white;
                        border-radius: 20px;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                        overflow: hidden;
                        text-align: center;
                    }
                    
                    .header {
                        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
                        color: white;
                        padding: 40px 30px;
                    }
                    
                    .delete-icon {
                        font-size: 4rem;
                        margin-bottom: 15px;
                        display: block;
                        animation: shake 1s ease-in-out;
                    }
                    
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                        20%, 40%, 60%, 80% { transform: translateX(5px); }
                    }
                    
                    .header h1 {
                        font-size: 2.2rem;
                        margin-bottom: 10px;
                        font-weight: 300;
                    }
                    
                    .content {
                        padding: 40px 30px;
                    }
                    
                    .message {
                        font-size: 1.2rem;
                        color: #333;
                        margin-bottom: 30px;
                        line-height: 1.6;
                    }
                    
                    .warning-box {
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 15px;
                        padding: 20px;
                        margin: 20px 0;
                        color: #856404;
                    }
                    
                    .actions {
                        display: flex;
                        gap: 15px;
                        justify-content: center;
                        flex-wrap: wrap;
                    }
                    
                    .btn {
                        padding: 12px 25px;
                        border-radius: 25px;
                        font-size: 16px;
                        font-weight: 600;
                        text-decoration: none;
                        transition: all 0.3s ease;
                        min-width: 120px;
                        display: inline-block;
                    }
                    
                    .btn-primary {
                        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                        color: white;
                    }
                    
                    .btn-primary:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
                    }
                    
                    .btn-secondary {
                        background: #6c757d;
                        color: white;
                    }
                    
                    .btn-secondary:hover {
                        background: #5a6268;
                        transform: translateY(-2px);
                    }
                    
                    @media (max-width: 768px) {
                        .container {
                            margin: 10px;
                            border-radius: 15px;
                        }
                        
                        .header {
                            padding: 30px 20px;
                        }
                        
                        .content {
                            padding: 30px 20px;
                        }
                        
                        .actions {
                            flex-direction: column;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <span class="delete-icon">🗑️</span>
                        <h1>All Deleted!</h1>
                    </div>
                    
                    <div class="content">
                        <div class="message">
                            All usernames have been successfully deleted from the database.
                        </div>
                        
                        <div class="warning-box">
                            ⚠️ This action cannot be undone. The database is now empty.
                        </div>
                        
                        <div class="actions">
                            <a href="/new" class="btn btn-primary">➕ Add New Username</a>
                            <a href="/" class="btn btn-secondary">👥 View All</a>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error deleting usernames:', error);
        res.status(500).send('Error deleting usernames from database');
    }
};

module.exports = {
    getUsernames,
    showUsernameForm,
    saveUsername,
    deleteAllUsernames: deleteAllUsernamesController
};
