import { createMuiTheme, colors } from "@material-ui/core";
import shadows from "./shadows";
import typography from "./typography";

const theme = createMuiTheme({
	palette: {
		background: {
			default: "#F0F3F4",
			paper: colors.common.white
		},
		primary: {
			main: "#D16002"
		},
		secondary: {
			main: "#000000"
		},
		text: {
			primary: "#000000",
			secondary: "#D16002"
		}
	},
	shadows,
	typography,
	overrides: {
		MuiInputLabel: {
			root: {
				fontSize: 14
			}
		},
		MuiMenuItem: {
			root: {
				"&$selected": {
					backgroundColor: "transparent" // updated backgroundColor
				}
			}
		}
	}
});

export default theme;
