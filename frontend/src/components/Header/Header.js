import { useNavigate } from 'react-router-dom'
import { ReactComponent as ArrowLeft } from 'assets/arrow-left.svg'
import "./Header.css"

function Header({ children }) {
	const navigate = useNavigate();

	return (
		<div className="header">
			<ArrowLeft
				className="icon"
				onClick={() => navigate(-1)}
			/>
			{ children }
		</div>
	)
}

export default Header;