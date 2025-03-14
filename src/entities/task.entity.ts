import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column({default: 'NEW'})
    status: string;

    @Column({default: null})
    http_code: number;

    @Column({default: null, type: 'bigint', nullable: true})
    updated_time: number | null;
}


export const isTaskEntity = (data: unknown): data is Task => {
    return data !== null && typeof data === 'object' && 'id' in data && 'url' in data;
}