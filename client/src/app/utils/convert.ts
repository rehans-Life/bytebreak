import { Option } from "../components/select";

export function convert<VT>(data: any[], field: string, value: string): Option<VT>[] {
    return data.map<Option<VT>>((data) => {
        return {
            value: data[value],
            label: data[field],
        }
    })
}