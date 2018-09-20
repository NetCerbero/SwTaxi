import t from 'tcomb-form-native';
export default formValidation = {
	email:t.refinement(t.String, (s)=>{
		return /@uagrm/.test(s);
	}),
	password: t.refinement(t.String, (s)=>{
		return s.length >= 6;
	})
}