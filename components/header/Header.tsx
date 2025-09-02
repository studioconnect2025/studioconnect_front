export const Header = () => {
    return (
    <header>
    <nav className="bg-black border-gray-200 px-4 lg:px-6 py-6 dark:bg-black height-16">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="#" className="flex items-center">
               <img src="/logo.png" alt="Logo" className="w-56 h-auto"/>
            </a>
            <div className="flex items-center lg:order-2">
                <a href="#" className="text-white p-2 mr-5">Log in</a>
                <a href="#" className="text-gray-900 bg-white rounded-lg p-2">Sign up</a>


            </div>
            <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                    <li>
                        <a href="#" className="block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white" aria-current="page">Explorar estudios</a>
                    </li>
                    <li>
                        <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Únete como anfitrión</a>
                    </li>
                 
                </ul>
            </div>
        </div>
    </nav>
</header>
    )
}