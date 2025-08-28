import "./Sidebar.css";

function Sidebar(){
    return (
        <section className="sidebar">
           
            <button>
                <img src="src/assets/blacklogo.png" alt="MiniGPT Logo"  className="logo"></img>
                <span><i className="fa-regular fa-pen-to-square"></i></span>
            </button>
         
            <ul className="history">
                <li>Thread1</li>
                <li>Thread2</li>
                <li>Thread3</li>
            </ul>
           
            <div className="sign">
                <p>By DreamGirl &hearts;</p>
            </div>
        </section>
    )
}

export default Sidebar;