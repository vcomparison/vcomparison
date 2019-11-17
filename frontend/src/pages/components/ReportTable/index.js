import React from 'react';
import {Button, Checkbox, Dropdown, Table} from "semantic-ui-react";
import './ReportTable.sass';

const ReportTable = ({fields}) => {
    return (
        <div>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>
                            <div className="report-table__half-cell">Technique</div>
                            <div>Patient Support Angle</div>
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            <div className="report-table__half-cell">Energy Mode</div>
                            <div>Collimator Angle</div>
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            <div className="report-table__half-cell">Monitor Units</div>
                            <div>Number Of Control Points</div>
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            <div className="report-table__half-cell">Gantry Angle Start</div>
                            <div>Jaw Positions</div>
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            <div className="report-table__half-cell">Gantry Angle Stop</div>
                            <div>Isocenter</div>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {fields.map(({
                        Id,
                        Technique,
                        PatientSupportAngle,
                        EnergyMode,
                        CollimatorAngle,
                        MonitorUnits,
                        NumberOfControlPoints,
                        GantryAngleStart,
                        GantryAngleStop,
                        JawPositions,
                        Isocenter
                    }) =>
                        <Table.Row>
                            <Table.Cell>
                                {Id}
                            </Table.Cell>
                            <Table.Cell>
                                <div className="report-table__half-cell">{Technique}</div>
                                <div>{PatientSupportAngle}</div>
                            </Table.Cell>
                            <Table.Cell>
                                <div className="report-table__half-cell">{EnergyMode}</div>
                                <div>{CollimatorAngle}</div>
                            </Table.Cell>
                            <Table.Cell>
                                <div className="report-table__half-cell">{MonitorUnits}</div>
                                <div>{NumberOfControlPoints}</div>
                            </Table.Cell>
                            <Table.Cell>
                                <div className="report-table__half-cell">{GantryAngleStart}</div>
                                <div>{JawPositions}</div>
                            </Table.Cell>
                            <Table.Cell>
                                <div className="report-table__half-cell">{GantryAngleStop}</div>
                                {/*<div>{Isocenter}</div>*/}
                            </Table.Cell>
                        </Table.Row>)
                    }
                </Table.Body>
            </Table>
        </div>
    )
}

export default ReportTable;
